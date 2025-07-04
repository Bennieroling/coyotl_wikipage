#!/bin/bash

echo "Fixing all API imports and calls..."

# Fix PageListPage
sed -i 's/import apiClient from/import { pageAPI } from/' src/pages/PageListPage.jsx
sed -i 's/apiClient\.get(`\/api\/pages/pageAPI.getPages(/' src/pages/PageListPage.jsx

# Fix SearchResultsPage  
sed -i 's/import api from/import { searchAPI } from/' src/pages/SearchResultsPage.jsx
sed -i 's/api\.searchWiki/searchAPI.search/g' src/pages/SearchResultsPage.jsx

# Fix HomePage copy
sed -i 's/import apiClient from/import { pageAPI } from/' "src/pages/HomePage copy.jsx"
sed -i 's/apiClient\.get(.\/api\/pages/pageAPI.getPages(/g' "src/pages/HomePage copy.jsx"

# Fix LoginPage
sed -i 's/import apiClient from/import { authAPI } from/' src/pages/LoginPage.jsx
sed -i 's/apiClient\.post(.\/auth\/login/authAPI.login(/g' src/pages/LoginPage.jsx

# Fix PageViewPage
sed -i 's/import apiClient from/import { pageAPI } from/' src/pages/PageViewPage.jsx
sed -i 's/apiClient\.getPage/pageAPI.getPage/g' src/pages/PageViewPage.jsx

# Fix RegisterPage  
sed -i 's/import apiClient from/import { authAPI } from/' src/pages/RegisterPage.jsx
sed -i 's/apiClient\.post(.\/auth\/register/authAPI.register(/g' src/pages/RegisterPage.jsx

# Fix FileBrowser
sed -i 's/import apiClient from/import { fileAPI } from/' src/components/files/FileBrowser.jsx
sed -i 's/apiClient\.get(`\/api\/files/fileAPI.getFiles(/g' src/components/files/FileBrowser.jsx
sed -i 's/apiClient\.delete(`\/api\/files/fileAPI.deleteFile(/g' src/components/files/FileBrowser.jsx

# Fix FileUploader
sed -i 's/import apiClient from/import { fileAPI } from/' src/components/files/FileUploader.jsx  
sed -i 's/apiClient\.post(.\/api\/files\/upload/fileAPI.uploadFile(/g' src/components/files/FileUploader.jsx

# Fix AuthContext
sed -i 's/import apiClient from/import { authAPI } from/' src/contexts/AuthContext.jsx
sed -i 's/apiClient\.get(.\/auth\/user/authAPI.getUser(/g' src/contexts/AuthContext.jsx

echo "All imports fixed!"
