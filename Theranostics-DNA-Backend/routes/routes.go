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

	// Define Routes
	router.GET(utils.RouteWelcome, controllers.WelcomeHandler)
	router.POST(utils.RouteLogin, controllers.LoginHandler)
	router.POST(utils.RouteForgetPassword, controllers.ForgetPasswordHandler)
	router.GET(utils.RouteFetchQuantityDiscount, controllers.FetchQuantityDiscountList)
	router.POST(utils.RouteEncryptProductDetails, controllers.EncryptProductDetails)
	router.POST(utils.RouteVerifyProductDetails, controllers.VerifyProduct)
	router.POST(utils.RouteProductPaymentDetails, controllers.OrderCreateHandler)
	router.GET(utils.RoutePaymentSuccessPaypal, controllers.HandlePaymentSuccess)
	router.POST(utils.RouteVerifyBarcode, controllers.VerifyBarcode)
	router.POST(utils.RouteKitRegister, controllers.KitRegister)
	router.POST(utils.RouteEncryptData, controllers.EncryptionDetails)

	// Protected Routes
	protected := router.Group("/api")
	protected.Use(middlewares.AuthMiddleware())
	protected.Use(middlewares.CreatePermissionMiddleware())
	// Add protected routes here
	protected.DELETE(utils.RouteLogout, controllers.LogoutHandler)
	protected.PATCH(utils.RouteResetPassword, controllers.ResetPasswordHandler)
	// User routes
	protected.PATCH(utils.RouteUpdateUser, controllers.UpdateUserInfoHandler)
	protected.GET(utils.RouteGetUserProfile, controllers.GetUserProfileHandler)
	protected.GET(utils.RouteGetAdminUserList, controllers.GetAdminUsersHandler)
	protected.POST(utils.RouteCreateAdminUser, controllers.CreateUserHandler)
	protected.PATCH(utils.RouteUpdateAdminUserProfile, controllers.UpdateUserProfileHandler)
	protected.PATCH(utils.RouteUpdateAdminUserStatus, controllers.UpdateUserStatusHandler)
	protected.PATCH(utils.RouteUpdateAdminUserPassword, controllers.UpdateUserPasswordHandler)
	protected.DELETE(utils.RouteDeleteAdminUser, controllers.DeleteUserHandler)

	// Notification routes
	protected.GET(utils.RouteNotification, controllers.GetUserNotifications)
	protected.GET(utils.RouteLatestNotification, controllers.GetLatestNotifications)
	protected.PATCH(utils.RouteMarkNotificationAsRead, controllers.MarkNotificationRead)
	protected.PATCH(utils.RouteMarkAllNotificationsAsRead, controllers.MarkAllNotificationsRead)
	protected.DELETE(utils.RouteNotification, controllers.DeleteUserNotifications)
	protected.DELETE(utils.RouteDeleteNotification, controllers.DeleteNotification)

	// Manage Inventory routes
	protected.POST(utils.RouteKitInfo, controllers.CreateKitHandler)
	protected.GET(utils.RouteKitInfo, controllers.GetKitsListHandler)
	protected.PATCH(utils.RouteKitInfoID, controllers.UpdateKitHandler)
	protected.DELETE(utils.RouteKitInfoID, controllers.DeleteKitHandler)
	protected.GET(utils.RouteQuantitySummary, controllers.GetKitsQuantitySummaryHandler)

	// Manage Customer routes
	protected.GET(utils.RouteviewCustomerWithOrders, controllers.GetCustomerOrderDetails)
	protected.GET(utils.RouteCustomer, controllers.GetCustomersWithOrders)

	// Manage Order routes
	protected.GET(utils.RouteOrder, controllers.GetOrdersWithCustomersInvoicePayments)
	protected.POST(utils.RouteAssignKit, controllers.AssignKit)
	protected.PATCH(utils.RouteChangeOrderStatus, controllers.UpdateOrderStatus)
	protected.GET(utils.RouteOrderCount, controllers.GetOrderCounts)

	// Manage Patient routes
	protected.GET(utils.RouteFetchedKitRegistrationList, controllers.GetPatientRegisterKitList)
	protected.PATCH(utils.RoutePatientUpdateStatus, controllers.UpdatePatientStatus)
	protected.PATCH(utils.RoutePatientUploadReport, controllers.FileUpload)

	// Global Search routes
	protected.GET(utils.RouteFetchedBarcodeDetails, controllers.FetchBarcodeDetails)

	// Manage Labs
	protected.GET(utils.RouteFetchedLabsDetails, controllers.GetAllLabs)

	// Handle 404
	router.NoRoute(controllers.NotFoundHandler)
}
