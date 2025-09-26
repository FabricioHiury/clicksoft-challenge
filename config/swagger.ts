import swaggerJSDoc from 'swagger-jsdoc'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Alocação de Salas - Clicksoft Challenge',
      version: '1.0.0',
      description: 'API para gerenciamento de alocação de estudantes em salas de aula',
      contact: {
        name: 'Clicksoft Challenge',
        email: 'contato@clicksoft.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Student: {
          type: 'object',
          required: ['name', 'email', 'registration', 'birthDate'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do estudante'
            },
            name: {
              type: 'string',
              description: 'Nome completo do estudante',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do estudante',
              example: 'joao.silva@email.com'
            },
            registration: {
              type: 'string',
              description: 'Número de matrícula do estudante',
              example: '2023001'
            },
            birthDate: {
              type: 'string',
              format: 'date',
              description: 'Data de nascimento do estudante',
              example: '1995-05-15'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        Teacher: {
          type: 'object',
          required: ['name', 'email', 'registration', 'birthDate'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do professor'
            },
            name: {
              type: 'string',
              description: 'Nome completo do professor',
              example: 'Maria Santos'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do professor',
              example: 'maria.santos@email.com'
            },
            registration: {
              type: 'string',
              description: 'Número de matrícula do professor',
              example: 'PROF001'
            },
            birthDate: {
              type: 'string',
              format: 'date',
              description: 'Data de nascimento do professor',
              example: '1980-03-20'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        Room: {
          type: 'object',
          required: ['roomNumber', 'capacity', 'teacherId'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da sala'
            },
            roomNumber: {
              type: 'string',
              description: 'Número da sala',
              example: '101'
            },
            capacity: {
              type: 'integer',
              description: 'Capacidade máxima da sala',
              example: 30
            },
            isAvailable: {
              type: 'boolean',
              description: 'Indica se a sala está disponível',
              default: true
            },
            teacherId: {
              type: 'integer',
              description: 'ID do professor responsável pela sala'
            },
            teacher: {
              $ref: '#/components/schemas/Teacher'
            },
            students: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Student'
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica se a operação foi bem-sucedida'
            },
            message: {
              type: 'string',
              description: 'Mensagem descritiva da operação'
            },
            data: {
              type: 'object',
              description: 'Dados retornados pela operação'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp da resposta'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica se a operação foi bem-sucedida'
            },
            message: {
              type: 'string',
              description: 'Mensagem descritiva da operação'
            },
            data: {
              type: 'array',
              items: {
                type: 'object'
              },
              description: 'Array de dados paginados'
            },
            meta: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  description: 'Total de registros'
                },
                perPage: {
                  type: 'integer',
                  description: 'Registros por página'
                },
                currentPage: {
                  type: 'integer',
                  description: 'Página atual'
                },
                lastPage: {
                  type: 'integer',
                  description: 'Última página'
                },
                firstPage: {
                  type: 'integer',
                  description: 'Primeira página'
                },
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp da resposta'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Dados de entrada inválidos'
            },
            error: {
              type: 'object',
              description: 'Detalhes dos erros de validação'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        NotFoundError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Recurso não encontrado'
            },
            error: {
              type: 'string'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    paths: {
      '/': {
        get: {
          tags: ['API Info'],
          summary: 'Informações da API',
          description: 'Retorna informações básicas sobre a API e seus endpoints',
          responses: {
            '200': {
              description: 'Informações da API retornadas com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      version: { type: 'string' },
                      endpoints: {
                        type: 'object',
                        properties: {
                          students: { type: 'string' },
                          teachers: { type: 'string' },
                          rooms: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/students': {
        post: {
          tags: ['Students'],
          summary: 'Cadastrar novo aluno',
          description: 'RF01: Permite que aluno se cadastre na aplicação',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'registration', 'birthDate'],
                  properties: {
                    name: { type: 'string', example: 'João Silva' },
                    email: { type: 'string', format: 'email', example: 'joao.silva@email.com' },
                    registration: { type: 'string', example: '2023001' },
                    birthDate: { type: 'string', format: 'date', example: '1995-05-15' }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Aluno cadastrado com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' }
                }
              }
            },
            '422': {
              description: 'Dados de entrada inválidos',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ValidationError' }
                }
              }
            }
          }
        }
      },
      '/api/students/{id}': {
        get: {
          tags: ['Students'],
          summary: 'Consultar dados do aluno',
          description: 'RF04: Permite que aluno consulte seus dados de cadastro',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do aluno'
            }
          ],
          responses: {
            '200': {
              description: 'Dados do aluno recuperados com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Student' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Aluno não encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        },
        put: {
          tags: ['Students'],
          summary: 'Editar dados do aluno',
          description: 'RF02: Permite que aluno edite seus dados de cadastro',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do aluno'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    registration: { type: 'string' },
                    birthDate: { type: 'string', format: 'date' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Dados do aluno atualizados com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' }
                }
              }
            },
            '404': {
              description: 'Aluno não encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Students'],
          summary: 'Excluir aluno',
          description: 'RF03: Permite que aluno exclua seus dados de cadastro',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do aluno'
            }
          ],
          responses: {
            '200': {
              description: 'Aluno excluído com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Aluno não encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        }
      },
      '/api/students/{id}/rooms': {
        get: {
          tags: ['Students'],
          summary: 'Consultar salas do aluno',
          description: 'RF16: Permite que aluno consulte todas as salas que deverá comparecer',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do aluno'
            }
          ],
          responses: {
            '200': {
              description: 'Salas do aluno recuperadas com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' }
                }
              }
            },
            '404': {
              description: 'Aluno não encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        }
      },
      '/api/teachers': {
        post: {
          tags: ['Teachers'],
          summary: 'Cadastrar novo professor',
          description: 'RF05: Permite que professor se cadastre na aplicação',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'registration', 'birthDate'],
                  properties: {
                    name: { type: 'string', example: 'Maria Santos' },
                    email: { type: 'string', format: 'email', example: 'maria.santos@email.com' },
                    registration: { type: 'string', example: 'PROF001' },
                    birthDate: { type: 'string', format: 'date', example: '1980-03-20' }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Professor cadastrado com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' }
                }
              }
            },
            '422': {
              description: 'Dados de entrada inválidos',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ValidationError' }
                }
              }
            }
          }
        }
      },
      '/api/teachers/{id}': {
        get: {
          tags: ['Teachers'],
          summary: 'Consultar dados do professor',
          description: 'RF08: Permite que professor consulte seus dados de cadastro',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do professor'
            }
          ],
          responses: {
            '200': {
              description: 'Dados do professor recuperados com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Teacher' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Professor não encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        },
        put: {
          tags: ['Teachers'],
          summary: 'Editar dados do professor',
          description: 'RF06: Permite que professor edite seus dados de cadastro',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do professor'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    registration: { type: 'string' },
                    birthDate: { type: 'string', format: 'date' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Dados do professor atualizados com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' }
                }
              }
            },
            '404': {
              description: 'Professor não encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Teachers'],
          summary: 'Excluir professor',
          description: 'RF07: Permite que professor exclua seus dados de cadastro',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do professor'
            }
          ],
          responses: {
            '200': {
              description: 'Professor excluído com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Professor não encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        }
      },
      '/api/teachers/{id}/rooms': {
        get: {
          tags: ['Teachers'],
          summary: 'Consultar salas do professor',
          description: 'RF12: Permite que professor consulte todas as suas salas',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do professor'
            }
          ],
          responses: {
            '200': {
              description: 'Salas do professor recuperadas com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' }
                }
              }
            },
            '404': {
              description: 'Professor não encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        },
        post: {
          tags: ['Teachers'],
          summary: 'Criar nova sala',
          description: 'RF09: Permite que professor cadastre uma sala',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do professor'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['roomNumber', 'capacity'],
                  properties: {
                    roomNumber: { type: 'string', example: '101' },
                    capacity: { type: 'integer', example: 30 },
                    isAvailable: { type: 'boolean', default: true }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Sala criada com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' }
                }
              }
            },
            '422': {
              description: 'Dados de entrada inválidos',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ValidationError' }
                }
              }
            }
          }
        }
      },
      '/api/teachers/{id}/rooms/{roomId}': {
        put: {
          tags: ['Teachers'],
          summary: 'Editar sala',
          description: 'RF10: Permite que professor edite dados de uma sala',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do professor'
            },
            {
              name: 'roomId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da sala'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    roomNumber: { type: 'string' },
                    capacity: { type: 'integer' },
                    isAvailable: { type: 'boolean' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Sala atualizada com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' }
                }
              }
            },
            '404': {
              description: 'Sala não encontrada',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Teachers'],
          summary: 'Excluir sala',
          description: 'RF11: Permite que professor exclua uma sala',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do professor'
            },
            {
              name: 'roomId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da sala'
            }
          ],
          responses: {
            '200': {
              description: 'Sala excluída com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Sala não encontrada',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        }
      },
      '/api/teachers/{id}/rooms/{roomId}/students': {
        post: {
          tags: ['Teachers'],
          summary: 'Alocar aluno na sala',
          description: 'RF13: Permite que professor aloque um aluno em uma sala',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do professor'
            },
            {
              name: 'roomId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da sala'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['studentId'],
                  properties: {
                    studentId: { type: 'integer', example: 1 }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Aluno alocado com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' }
                }
              }
            },
            '404': {
              description: 'Professor, sala ou aluno não encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Teachers'],
          summary: 'Desalocar aluno da sala',
          description: 'RF14: Permite que professor desaloque um aluno de uma sala',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do professor'
            },
            {
              name: 'roomId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da sala'
            },
            {
              name: 'studentId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do aluno'
            }
          ],
          responses: {
            '200': {
              description: 'Aluno desalocado com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' }
                }
              }
            },
            '404': {
              description: 'Professor, sala ou aluno não encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        },
        get: {
          tags: ['Teachers'],
          summary: 'Consultar alunos da sala',
          description: 'RF15: Permite que professor consulte todos os alunos de uma sala',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID do professor'
            },
            {
              name: 'roomId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da sala'
            }
          ],
          responses: {
            '200': {
              description: 'Alunos da sala recuperados com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' }
                }
              }
            },
            '404': {
              description: 'Professor ou sala não encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        }
      },
      '/api/rooms': {
        get: {
          tags: ['Rooms'],
          summary: 'Listar todas as salas',
          description: 'Lista todas as salas com paginação',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Número da página'
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10, maximum: 50 },
              description: 'Número de itens por página'
            }
          ],
          responses: {
            '200': {
              description: 'Salas recuperadas com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PaginatedResponse' }
                }
              }
            }
          }
        }
      },
      '/api/rooms/available': {
        get: {
          tags: ['Rooms'],
          summary: 'Listar salas disponíveis',
          description: 'Lista todas as salas disponíveis com paginação',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Número da página'
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10, maximum: 50 },
              description: 'Número de itens por página'
            }
          ],
          responses: {
            '200': {
              description: 'Salas disponíveis recuperadas com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PaginatedResponse' }
                }
              }
            }
          }
        }
      },
      '/api/rooms/{id}': {
        get: {
          tags: ['Rooms'],
          summary: 'Consultar detalhes da sala',
          description: 'Consulta detalhes de uma sala específica',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID da sala'
            }
          ],
          responses: {
            '200': {
              description: 'Detalhes da sala recuperados com sucesso',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' }
                }
              }
            },
            '404': {
              description: 'Sala não encontrada',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/NotFoundError' }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./start/routes.ts', './app/Controllers/Http/*.ts']
}

const specs = swaggerJSDoc(options)

export default specs