package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "batysmonitor/services"
)

// GetMarkers returns all risk markers as GeoJSON
func GetMarkers(c *gin.Context) {
    category := c.Query("category")   // customs, education, healthcare
    status := c.Query("status")       // RED, YELLOW, GREEN
    district := c.Query("district")

    markers, err := services.FetchMarkers(category, status, district)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to fetch markers",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "type":     "FeatureCollection",
        "features": markers,
    })
}

// UpdateRiskStatus updates risk level for a subject
func UpdateRiskStatus(c *gin.Context) {
    id := c.Param("id")

    var input struct {
        Status      string `json:"status" binding:"required"`
        Description string `json:"description"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    err := services.UpdateRisk(id, input.Status, input.Description)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to update risk status",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Risk status updated"})
}