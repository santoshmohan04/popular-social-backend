export const swaggerDocument = {
  openapi: '3.0.1',
  info: {
    title: 'popular-social-backend API',
    version: '1.0.0',
    description:
      'Lightweight social backend: posts, image uploads and realtime events. See /docs for interactive API.',
  },
  servers: [
    {
      url: 'http://localhost:9000',
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Health', description: 'Liveness and readiness endpoints' },
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Posts', description: 'Post and upload endpoints' },
  ],
  paths: {
    '/': {
      get: {
        tags: ['Health'],
        summary: 'Start page',
        description: 'Service landing page with links to docs and health endpoints',
        responses: {
          '200': { description: 'HTML start page' },
        },
      },
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Liveness check',
        responses: {
          '200': { description: 'Service is alive' },
        },
      },
    },
    '/ready': {
      get: {
        tags: ['Health'],
        summary: 'Readiness check',
        responses: {
          '200': { description: 'Service ready' },
          '503': { description: 'Service not ready' },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login or register a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User logged in successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        displayName: { type: 'string' },
                        email: { type: 'string' },
                        photoURL: { type: 'string' },
                      },
                    },
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                    expiresAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'User profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    displayName: { type: 'string' },
                    email: { type: 'string' },
                    photoURL: { type: 'string' },
                  },
                },
              },
            },
          },
          '401': { description: 'Not authorized' },
        },
      },
    },
    '/api/v1/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' },
                },
                required: ['refreshToken'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Access token refreshed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    expiresAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '401': { description: 'Refresh token is required' },
          '403': { description: 'Invalid refresh token' },
        },
      },
    },
    '/api/v1/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout user',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': { description: 'Logged out successfully' },
          '401': { description: 'Not authorized' },
        },
      },
    },
    '/api/v1/posts': {
      get: {
        tags: ['Posts'],
        summary: 'List posts',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'sort', in: 'query', schema: { type: 'string', default: 'desc' } },
        ],
        responses: {
          '200': { description: 'A paginated list of posts' },
        },
      },
    },
    '/api/v1/upload/post': {
      post: {
        tags: ['Posts'],
        summary: 'Create a post (json)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: { type: 'string' },
                  text: { type: 'string' },
                  imgName: { type: 'string' },
                  avatar: { type: 'string' },
                },
                required: ['user', 'text'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Post created' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'jwt',
      },
    },
  },
};

export default swaggerDocument;

