// config/config.go
package config

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitDB initializes the database connection, checks for the existence of the target database,
// and creates it if it doesn't exist.
func InitDB() {
	// Load environment variables
	LoadEnv()
	cfg := AppConfig

	// Construct the Data Source Name (DSN) for connecting to the default 'postgres' database
	defaultDsn := fmt.Sprintf("host=%s user=%s password=%s dbname=postgres port=%s sslmode=disable TimeZone=UTC",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBPort)

	// Open a connection to the default 'postgres' database
	defaultDB, err := gorm.Open(postgres.Open(defaultDsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent), // Suppress default logging
	})
	if err != nil {
		log.Fatalf("Failed to connect to default database: %v", err)
	}

	// Check if the target database exists
	var exists bool
	query := "SELECT 1 FROM pg_database WHERE datname = ?"
	err = defaultDB.Raw(query, cfg.DBName).Scan(&exists).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		log.Fatalf("Failed to check if database exists: %v", err)
	}

	if !exists {
		// Create the target database if it doesn't exist
		createDBQuery := fmt.Sprintf("CREATE DATABASE %s", cfg.DBName)
		if err := defaultDB.Exec(createDBQuery).Error; err != nil {
			log.Fatalf("Failed to create database %s: %v", cfg.DBName, err)
		}
		log.Printf("Database %s created successfully", cfg.DBName)
	} else {
		log.Printf("Database %s already exists", cfg.DBName)
	}

	// Construct the DSN for connecting to the target database
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort)

	// Open a connection to the target database
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Printf("%s environment: %s", "Database connection established", cfg.Environment)
}