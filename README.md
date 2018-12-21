# EthereumAuth(Name susceptible to change)
This is a website where traitional authentication and authentication using ethereum account and metamask has been implemented

## Getting Started
Clone this project to your local system using the following command on your terminal .
  ```
  $ git clone https://github.com/palpriyanka16/EthereumBasedAuth.git
  ```
### Prerequisites
  * Install NodeJS and npm  
      * Windows users can install by downloading the package from the site
    [https://nodejs.org/en/download/](https://nodejs.org/en/download/)  
      * Linux users can  install running the following commands on the terminal
        ```
        $ sudo apt-get update
        $ sudo apt-get install nodejs
        $ sudo apt-get install npm
        ```
   * Install mysql  
        * Windows users can install by following the instructions given in the link
      https://dev.mysql.com/doc/refman/5.7/en/windows-installation.html
        * Linux users can use the following commands
          ```
          $ sudo apt-get install mysql
          ```
### Running the project
* Open the terminal inside the repo folder and run the following commands :
    ```
    $ npm install
    ```
    * This will install all the dependencies in node_modules folder
* Configure your database
    * Go to the config folder inside the repo folder. You will find a file named config.example.json .
    * Copy the contents of this file to a file named config.json.
    * In config.json fill in your db credentials like dbname,username and password
* Run the server using the following command :
    ```
    $ npm start
    ```
    This will create the tables necessary to run the application
    
## Built with
  * NodeJS - Cross platform Javascript run time environment
  * Express - Web framework for NodeJS
  * Sequelize - ORM for mysql
  
  