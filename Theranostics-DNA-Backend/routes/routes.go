// routes/routes.go
package routes

import (
	"theransticslabs/m/controllers"
	"theransticslabs/m/middlewares"
	"theransticslabs/m/utils"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	// Apply Logging Middleware
	router.Use(middlewares.LoggingMiddleware())

	// Protected Routes
	// User routes
	router.PATCH(utils.RouteUpdateUser, controllers.UpdateUserInfoHandler)
	router.GET(utils.RouteGetUserProfile, controllers.GetUserProfileHandler)
	router.GET(utils.RouteGetAdminUserList, controllers.GetAdminUsersHandler)
	router.POST(utils.RouteCreateAdminUser, controllers.CreateUserHandler)
	router.PATCH(utils.RouteUpdateAdminUserProfile, controllers.UpdateUserProfileHandler)
	router.PATCH(utils.RouteUpdateAdminUserStatus, controllers.UpdateUserStatusHandler)
	router.PATCH(utils.RouteUpdateAdminUserPassword, controllers.UpdateUserPasswordHandler)
	router.DELETE(utils.RouteDeleteAdminUser, controllers.DeleteUserHandler)
}
