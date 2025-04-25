export const environment = {
    production: true,
    appName: 'User Management System',
    apiUrl: '/api',
    authApiUrl: '/api/auth',
    userApiUrl: '/api/users',
    roleApiUrl: '/api/roles',
    permissionApiUrl: '/api/permissions',
    tokenExpirationTime: 3600, // em segundos (1 hora)
    refreshTokenExpirationTime: 86400, // em segundos (24 horas)
    defaultLanguage: 'pt-BR',
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'current_user',
    version: '1.0.0',
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [5, 10, 20, 50, 100]
    },
    requestTimeout: 30000, // timeout para requisições em ms
    debounceTime: 300, // tempo para debounce em inputs de pesquisa
    dateFormat: 'dd/MM/yyyy HH:mm',
    loggingEnabled: false,
  };