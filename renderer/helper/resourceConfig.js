
const { ipcMain , ipcRenderer } = require('electron')
const path = require('path')
const axios = require('axios')

const INIT_MAP = {
    productCategory: {
        formId: 'productCategoryInitForm',
        eventName: 'init-all-product-categories',
        resourceName: "product_category",
        fileName: "./productCategory/productCategory.html",
        addResourceWindowEventName : "add-productCategory-window",
        createResourceViewBtn: 'createProductCategoryBtn'
    },
  
    product: {
        formId: 'productInitForm',
        eventName: 'init-all-products',
        resourceName: "product",
        fileName: "./products/product.html",
        addResourceWindowEventName : "add-product-window",
        createResourceViewBtn: 'createProductBtn'
    },
     application: {
        formId: 'applicationInitForm',
        eventName: 'init-all-applications',
        resourceName: "application",
        fileName: "./application/application.html",
        addResourceWindowEventName : "add-application-window",
        createResourceViewBtn: 'createApplicationBtn'
    },
    notification: {
        formId: 'notificationInitForm',
        eventName: 'init-all-notifications',
        resourceName: "notification",
        fileName: "./notification/notification.html",
        addResourceWindowEventName : "add-notification-window",
        createResourceViewBtn: "createNotificationBtn"
    }
}

const helpers  = {
    INIT_MAP
}
module.exports = helpers;