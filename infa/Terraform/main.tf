terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.0.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "Travel_Agency"
  location = "East US"
}

resource "azurerm_container_registry" "acr" {
  name                = "travelagencyacr"  # Must be unique
  resource_group_name = azurerm_resource_group.rg.name  # Reference to the Travel_Agency RG
  location            = azurerm_resource_group.rg.location  # Reference to the Travel_Agency RG location
  sku                 = "Basic"
  admin_enabled       = true  # Set to 'false' if you don't want the admin user enabled
}
