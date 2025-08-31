package main

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/google/uuid"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	// Inicializar banco de dados
	initDB()

	// Configurar Gin
	r := gin.Default()

	// Configurar CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// Rotas para a API (devem vir antes das rotas de arquivos estáticos)
	api := r.Group("/api")
	{
		api.GET("/tasks", getTasks)
		api.GET("/tasks/:id", getTask)
		api.POST("/tasks", createTask)
		api.PUT("/tasks/:id", updateTask)
		api.DELETE("/tasks/:id", deleteTask)

		api.POST("/pomodoros", createPomodoro)
		api.GET("/pomodoros/daily", getDailyStats)
		api.GET("/pomodoros/task/:taskId", getPomodorosByTask)
	}

	// Servir arquivos estáticos do frontend Angular
	// O caminho "/" aqui significa que ele vai servir o conteúdo do diretório static/browser
	// para qualquer rota que não seja da API. Isso é o que causa o conflito.
	// Vamos mudar para servir de um caminho específico ou usar um fallback mais inteligente.
	// r.StaticFS("/", http.Dir("./static/browser"))

	// Servir arquivos estáticos do frontend Angular de forma mais específica
	r.StaticFS("/assets", http.Dir("./static/browser/assets"))
	// Servir o index.html para a rota raiz
	r.GET("/", func(c *gin.Context) {
		c.File("./static/browser/index.html")
	})

	// Fallback para SPA (Single Page Application) para rotas não encontradas
	r.NoRoute(func(c *gin.Context) {
		// Verifica se a rota não é para a API
		if !strings.HasPrefix(c.Request.URL.Path, "/api/") {
			// Tenta servir o arquivo estático correspondente
			filepath := "./static/browser" + c.Request.URL.Path
			if _, err := os.Stat(filepath); err == nil {
				c.File(filepath)
			} else {
				// Se não for um arquivo estático, serve o index.html (SPA fallback)
				c.File("./static/browser/index.html")
			}
		} else {
			// Se for uma rota da API que não foi encontrada, retorna 404
			c.JSON(http.StatusNotFound, gin.H{"error": "Rota da API não encontrada"})
		}
	})

	// Determinar porta
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Servidor rodando na porta %s", port)
	r.Run("0.0.0.0:" + port)
}

func initDB() {
	var err error
	db, err = gorm.Open(sqlite.Open("pomodoro.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Falha ao conectar com o banco de dados:", err)
	}

	// Migrar esquemas
	db.AutoMigrate(&Task{}, &Pomodoro{})
}

// Handlers para tarefas
func getTasks(c *gin.Context) {
	var tasks []Task
	db.Find(&tasks)
	c.JSON(http.StatusOK, tasks)
}

func getTask(c *gin.Context) {
	id := c.Param("id")
	var task Task
	if err := db.First(&task, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarefa não encontrada"})
		return
	}
	c.JSON(http.StatusOK, task)
}

func createTask(c *gin.Context) {
	var task Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task.ID = uuid.New().String()
	task.DataCriacao = time.Now()

	if err := db.Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar tarefa"})
		return
	}

	c.JSON(http.StatusCreated, task)
}

func updateTask(c *gin.Context) {
	id := c.Param("id")
	var task Task
	if err := db.First(&task, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tarefa não encontrada"})
		return
	}

	var updateData Task
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task.Titulo = updateData.Titulo
	task.Descricao = updateData.Descricao
	task.Concluida = updateData.Concluida

	if err := db.Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar tarefa"})
		return
	}

	c.JSON(http.StatusOK, task)
}

func deleteTask(c *gin.Context) {
	id := c.Param("id")
	if err := db.Delete(&Task{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar tarefa"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Tarefa deletada com sucesso"})
}

// Handlers para pomodoros
func createPomodoro(c *gin.Context) {
	var pomodoro Pomodoro
	if err := c.ShouldBindJSON(&pomodoro); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pomodoro.ID = uuid.New().String()

	if err := db.Create(&pomodoro).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar pomodoro"})
		return
	}

	c.JSON(http.StatusCreated, pomodoro)
}

func getDailyStats(c *gin.Context) {
	var results []struct {
		Data                string
		TotalPomodoros      int
		TempoTotalTrabalho  int
		TempoTotalDescanso  int
	}

	db.Raw(`
		SELECT 
			DATE(data_inicio) as data,
			COUNT(*) as total_pomodoros,
			SUM(duracao_trabalho) as tempo_total_trabalho,
			SUM(duracao_descanso) as tempo_total_descanso
		FROM pomodoros 
		GROUP BY DATE(data_inicio)
		ORDER BY data DESC
		LIMIT 30
	`).Scan(&results)

	var stats []PomodoroStats
	for _, result := range results {
		stats = append(stats, PomodoroStats{
			Data:               result.Data,
			TotalPomodoros:     result.TotalPomodoros,
			TempoTotalTrabalho: result.TempoTotalTrabalho,
			TempoTotalDescanso: result.TempoTotalDescanso,
		})
	}

	c.JSON(http.StatusOK, stats)
}

func getPomodorosByTask(c *gin.Context) {
	taskId := c.Param("taskId")
	var pomodoros []Pomodoro
	db.Where("tarefa_id = ?", taskId).Find(&pomodoros)
	c.JSON(http.StatusOK, pomodoros)
}


