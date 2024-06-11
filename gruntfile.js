module.exports = function(grunt){
    grunt.initConfig({
        // Lê o conteúdo do arquivo package.json
        pkg: grunt.file.readJSON('package.json'),

        // Configuração para compilar arquivos Less
        less: {
            // Configuração para ambiente de desenvolvimento
            development: {
                files: {
                    'dev/styles/main.css': 'src/styles/main.less' // Compila main.less para main.css em dev/styles/
                }
            },
            // Configuração para ambiente de produção
            production: {
                options: {
                    compress: true, // Comprime o CSS
                },
                files: {
                    'dist/styles/main.min.css': 'src/styles/main.less' // Compila e comprime main.less para main.min.css em dist/styles/
                }
            }
        },

        // Substitui placeholders no arquivo index.html
        replace: {
            // Configuração para ambiente de desenvolvimento
            dev: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS', // Placeholder para o endereço do CSS
                            replacement: './styles/main.css' // Substitui pelo endereço do CSS em dev/
                        },
                        {
                            match: 'ENDERECO_DO_JS', // Placeholder para o endereço do JavaScript
                            replacement: '../src/scripts/main.js' // Substitui pelo endereço do JavaScript em src/scripts/
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'], // Arquivo base
                        dest: 'dev/' // Diretório de destino
                    }
                ]
            },
            // Configuração para ambiente de produção
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS', // Placeholder para o endereço do CSS
                            replacement: './styles/main.min.css' // Substitui pelo endereço do CSS em dist/
                        },
                        {
                            match: 'ENDERECO_DO_JS', // Placeholder para o endereço do JavaScript
                            replacement: './src/scripts/main.min.js' // Substitui pelo endereço do JavaScript em src/scripts/
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'], // Arquivo base
                        dest: 'dist/' // Diretório de destino
                    }
                ]
            }
        },

        // Observa alterações nos arquivos Less e HTML
        watch: {
            less: {
                files: ['src/styles/**/*.less'], // Observa todos os arquivos Less dentro de src/styles/
                tasks: ['less:development'] // Executa a tarefa de compilação Less para desenvolvimento
            },
            html: {
                files: ['src/index.html'], // Observa o arquivo index.html
                tasks: ['replace:dev', 'replace:dist'] // Executa a substituição de placeholders para dev e dist
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true, 
                    collapseWhiteSpace: true
                }, 
                files: {
                    'prebuild/index.html': 'src/index.html'
                }
            }
        }, 
        clean: ['prebuild'],
        uglify: {
            target: {
                files: {
                    'dist/scripts/main.min.js' : 'src/scripts/main.js'
                }
            }
        }
    });

    // Carrega plugins Grunt
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    // Registra tarefas Grunt
    grunt.registerTask('default', ['watch']); // Tarefa padrão para observar alterações nos arquivos
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']); 
};
