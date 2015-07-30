# config valid only for Capistrano 3.1
lock '3.2.1'

set :application, 'schweidandsons'
set :repo_url, 'git@github.com:nightagency/schweidandsons.git'

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# Default deploy_to directory is /var/www/my_app
# set :deploy_to, '/var/www/my_app'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 30

namespace :composer do
  task :setup do
    on roles(:app) do
      execute "cd #{deploy_to} && curl -sS https://getcomposer.org/installer | php"
    end
  end

  task :deps do
    on roles(:app) do
      execute "php #{deploy_to}/composer.phar install -o -d #{release_path}/www"
    end
  end

  task :cache_folder do
    on roles(:app) do
      execute "mkdir #{release_path}/www/cache"
      execute "chmod 777 #{release_path}/www/cache"
    end
  end
end

namespace :deploy do
  before :publishing, :'composer:setup'
  before :publishing, :'composer:deps'
  before :publishing, :'composer:cache_folder'
end

