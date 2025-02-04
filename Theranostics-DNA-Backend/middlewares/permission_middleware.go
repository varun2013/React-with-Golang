// middlewares/permission_middleware.go
package middlewares

import (
	"net/http"
	"regexp"
	"strings"
	"theransticslabs/m/utils"

	"github.com/gin-gonic/gin"
)

// RoutePermission defines which roles can access a specific route
type RoutePermission struct {
	Route  string   // Route path from utils.Routes
	Roles  []string // Allowed roles for this route
	Method string   // HTTP method (GET, POST, etc.)
}

// Define allowed roles
var AllowedRoles = []string{
	"super-admin",
	"admin",
	"user",
}

// RoutePermissions maps routes to their permitted roles
// Using the route constants from utils.Routes for consistency
var RoutePermissions = []RoutePermission{
	{
		Route:  "/api" + utils.RouteLogout,
		Roles:  []string{"super-admin", "admin", "user"},
		Method: http.MethodDelete,
	},
	{
		Route:  "/api" + utils.RouteResetPassword,
		Roles:  []string{"super-admin", "admin", "user"},
		Method: http.MethodPatch,
	},
	{
		Route:  "/api" + utils.RouteUpdateUser,
		Roles:  []string{"super-admin", "admin", "user"},
		Method: http.MethodPatch,
	},
	{
		Route:  "/api" + utils.RouteGetUserProfile,
		Roles:  []string{"super-admin", "admin", "user"},
		Method: http.MethodGet,
	},
	{
		Route:  "/api" + utils.RouteGetAdminUserList,
		Roles:  []string{"super-admin"},
		Method: http.MethodGet,
	},
	{
		Route:  "/api" + utils.RouteCreateAdminUser,
		Roles:  []string{"super-admin"},
		Method: http.MethodPost,
	},
	{
		Route:  "/api" + utils.RouteUpdateAdminUserProfile,
		Roles:  []string{"super-admin"},
		Method: http.MethodPatch,
	},
	{
		Route:  "/api" + utils.RouteUpdateAdminUserPassword,
		Roles:  []string{"super-admin"},
		Method: http.MethodPatch,
	},
	{
		Route:  "/api" + utils.RouteUpdateAdminUserStatus,
		Roles:  []string{"super-admin"},
		Method: http.MethodPatch,
	},
	{
		Route:  "/api" + utils.RouteDeleteAdminUser,
		Roles:  []string{"super-admin"},
		Method: http.MethodDelete,
	},
	{
		Route:  "/api" + utils.RouteKitInfo,
		Roles:  []string{"super-admin", "admin"},
		Method: "", // Empty means allow all methods
	},
	{
		Route:  "/api" + utils.RouteKitInfoID,
		Roles:  []string{"super-admin", "admin"},
		Method: "", // Empty means allow all methods
	},
	{
		Route:  "/api" + utils.RouteQuantitySummary,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodGet,
	},
	{
		Route:  "/api" + utils.RouteCustomer,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodGet,
	},
	{
		Route:  "/api" + utils.RouteOrder,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodGet,
	},
	{
		Route:  "/api" + utils.RouteAssignKit,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodPost,
	},
	{
		Route:  "/api" + utils.RouteChangeOrderStatus,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodPatch,
	},
	{
		Route:  "/api" + utils.RouteviewCustomerWithOrders,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodGet,
	},
	{
		Route:  "/api" + utils.RouteNotification,
		Roles:  []string{"super-admin", "admin"},
		Method: "",
	},
	{
		Route:  "/api" + utils.RouteLatestNotification,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodGet,
	},
	{
		Route:  "/api" + utils.RouteMarkNotificationAsRead,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodPatch,
	},
	{
		Route:  "/api" + utils.RouteMarkAllNotificationsAsRead,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodPatch,
	},
	{
		Route:  "/api" + utils.RouteOrderCount,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodGet,
	},
	{
		Route:  "/api" + utils.RouteFetchedKitRegistrationList,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodGet,
	},
	{
		Route:  "/api" + utils.RoutePatientUpdateStatus,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodPatch,
	},
	{
		Route:  "/api" + utils.RoutePatientUploadReport,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodPatch,
	},
	{
		Route:  "/api" + utils.RouteDeleteNotification,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodDelete,
	},
	{
		Route:  "/api" + utils.RouteFetchedBarcodeDetails,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodGet,
	},
	{
		Route:  "/api" + utils.RouteFetchedLabsDetails,
		Roles:  []string{"super-admin", "admin"},
		Method: http.MethodGet,
	},
}

// CheckPermission checks if a user's role has permission for the given route and method
func CheckPermission(userRole, route, method string) bool {
	// Convert role to lowercase for consistent comparison
	userRole = strings.ToLower(userRole)

	// First check if the role is valid
	isValidRole := false
	for _, role := range AllowedRoles {
		if strings.ToLower(role) == userRole {
			isValidRole = true
			break
		}
	}
	if !isValidRole {
		return false
	}

	// Check permissions for the route
	for _, permission := range RoutePermissions {
		// Convert route pattern to regex for matching
		routePattern := strings.Replace(permission.Route, ":id", "[^/]+", -1)

		matched, _ := regexp.MatchString("^"+routePattern+"$", route)

		if matched {
			// If method is specified, it must match
			if permission.Method != "" && permission.Method != method {
				continue
			}

			// Check if user's role is allowed
			for _, allowedRole := range permission.Roles {
				if strings.ToLower(allowedRole) == userRole {
					return true
				}
			}
		}
	}

	return false
}

// CreatePermissionMiddleware creates a middleware that checks permissions
func CreatePermissionMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get user from context (set by AuthMiddleware)
		user, ok := GetUserFromContext(c)
		if !ok {
			utils.JSONResponse(c, http.StatusUnauthorized, utils.MsgUserNotAuthenticated, nil)
			c.Abort()
			return
		}

		// Check if user has permission for this route
		hasPermission := CheckPermission(user.Role.Name, c.Request.URL.Path, c.Request.Method)
		if !hasPermission {
			utils.JSONResponse(c, http.StatusForbidden, utils.MsgAccessDeniedForOtherUser, nil)
			c.Abort()
			return
		}

		c.Next()
	}
}
