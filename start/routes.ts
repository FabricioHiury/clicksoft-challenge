import Route from '@ioc:Adonis/Core/Route'

Route.get('/api-docs', async ({ response }) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>API de Alocação de Salas - Documentação</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin:0;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api-docs.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>
  `
  response.type('text/html')
  return html
})

Route.get('/api-docs.json', async ({ response }) => {
  try {
    const swaggerSpecs = await import('../config/swagger')
    return swaggerSpecs.default
  } catch (error) {
    return response.status(500).json({ error: 'Erro ao carregar especificação' })
  }
})

Route.get('/', async () => {
  return {
    message: 'API de Alocação de Salas - Clicksoft Challenge',
    version: '1.0.0',
    endpoints: {
      students: '/api/students',
      teachers: '/api/teachers',
      rooms: '/api/rooms'
    }
  }
})

// Rotas para Estudantes
Route.group(() => {
  // Listar todos os estudantes com paginação
  Route.get('/', 'StudentsController.index')
  
  // RF01: Permitir que aluno se cadastre na aplicação
  Route.post('/', 'StudentsController.store')
  
  // RF04: Permitir que aluno consulte seus dados de cadastro
  Route.get('/:id', 'StudentsController.show')
  
  // RF02: Permitir que aluno edite seus dados de cadastro
  Route.put('/:id', 'StudentsController.update')
  
  // RF03: Permitir que aluno exclua seus dados de cadastro
  Route.delete('/:id', 'StudentsController.destroy')
  
  // RF16: Permitir que aluno consulte todas as salas que deverá comparecer
  Route.get('/:id/rooms', 'StudentsController.getRooms')
}).prefix('/api/students')

// Rotas para Professores
Route.group(() => {
  // RF16: Permitir listar todos os professores com paginação
  Route.get('/', 'TeachersController.index')
  
  // RF05: Permitir que professor se cadastre na aplicação
  Route.post('/', 'TeachersController.store')
  
  // RF08: Permitir que professor consulte seus dados de cadastro
  Route.get('/:id', 'TeachersController.show')
  
  // RF06: Permitir que professor edite seus dados de cadastro
  Route.put('/:id', 'TeachersController.update')
  
  // RF07: Permitir que professor exclua seus dados de cadastro
  Route.delete('/:id', 'TeachersController.destroy')
  
  // RF09: Permitir que professor cadastre uma sala
  Route.post('/:id/rooms', 'TeachersController.createRoom')
  
  // RF10: Permitir que professor edite dados de uma sala
  Route.put('/:id/rooms/:roomId', 'TeachersController.updateRoom')
  
  // RF11: Permitir que professor exclua uma sala
  Route.delete('/:id/rooms/:roomId', 'TeachersController.deleteRoom')
  
  // RF12: Permitir que professor consulte todas as suas salas
  Route.get('/:id/rooms', 'TeachersController.getRooms')
  
  // RF13: Permitir que professor aloque um aluno em uma sala
  Route.post('/:id/rooms/:roomId/students', 'TeachersController.allocateStudent')
  
  // RF14: Permitir que professor desaloque um aluno de uma sala
  Route.delete('/:id/rooms/:roomId/students/:studentId', 'TeachersController.deallocateStudent')
  
  // RF15: Permitir que professor consulte todos os alunos de uma sala
  Route.get('/:id/rooms/:roomId/students', 'TeachersController.getRoomStudents')
}).prefix('/api/teachers')

// Rotas para Salas (consultas gerais)
Route.group(() => {
  // Listar todas as salas disponíveis
  Route.get('/available', 'RoomsController.getAvailableRooms')
  
  // Listar todas as salas
  Route.get('/', 'RoomsController.index')
  
  // Consultar detalhes de uma sala específica
  Route.get('/:id', 'RoomsController.show')
}).prefix('/api/rooms')
