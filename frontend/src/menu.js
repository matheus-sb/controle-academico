export default [
  { 'header': 'Admin' },
  { 'href': '/inicial', 'title': 'Inicial', 'icon': 'home' },
  {
    'title': 'Cadastros',
    'icon': 'widgets',
    'items': [
      { 'href': '/cadastro/alunos', icon: 'people', 'title': 'Cadastro de alunos' }
    ]
  },
  { divider: true },

  { 'href': '/logout', 'icon': 'exit_to_app', 'title': 'Sair' }
]
