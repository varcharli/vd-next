# Video Collection and Playback Project

This project is a video collection and playback application built with Next.js, NestJS, and Postgres or MySQL. The project includes a client-side application for displaying videos and a server-side application for managing them.

## Structure

```plainttext
client/ 
server/
docker-compose.yml
```

### Client Side

The client-side application is built with Next.js and includes the following key files and directories:

- `.env.local` and `.env.production`: Environment configuration files.
- `next.config.ts`: Next.js configuration file.
- `pages/`: Contains the Next.js pages.
- `components/`: Contains the React components.
- `styles/`: Contains the CSS and TailwindCSS styles.

### Server Side

The server-side application is built with NestJS and includes the following key files and directories:

- `.env` and `.env.production`: Environment configuration files.
- `src/`: Contains the NestJS source code.
- `test/`: Contains the test files.
- `sql/`: Contains SQL scripts.

## Production

The project includes Docker support. To build and run the Docker containers, use the following commands:

```sh
docker-compose up --build
```

`docker-compose.yml`

```docker
services:
  nextjs:
    restart: always
    build:
      context: ./client
    ports:
      - "3101:3000"
    env_file:
      - ./client/.env.production
    environment:
      - NODE_ENV=production
    depends_on:
      - nestjs

  nestjs:
    restart: always
    build:
      context: ./server
    ports:
      - "3100:3000"
    env_file:
      - ./server/.env.production
    environment:
      - NODE_ENV=production
```

If you need to add a database service, you can choose either Postgres or MySQL.
The following example adds a Postgres service.

```docker
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - ./data:/var/lib/postgresql/data

```

MySql service.

```docker
  db:
    image: mysql:8
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: mysql
      MYSQL_USER: mysql
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - ./mysql:/var/lib/mysql

```

## Development

Requires Node.js version 20 or higher.

### Installation

To install the project dependencies, run the following command in both the `client` and `server` directories:

```sh
npm install
```

### Running the Application under development mode

#### Client

To run the client-side application, navigate to the `client` directory and run:

```sh
npm run dev
```

#### Server

To run the server-side application, navigate to the `server` directory and run:

```sh
npm run start
```
## API Endpoints

The server-side application exposes several API endpoints for managing video collections and playback. Here are some of the key endpoints:

- `GET /scraper/projects`: Get all active projects.
- `POST /scraper/projects/:id/pages/:pageNumber`: Push a new project page.
- `GET /scraper/projects/:id/items`: Get all items for a project.
- `POST /scraper/projects/:id/items/:itemId`: Push a new project item.

## Services

The server-side application includes several services for managing video collections and playback. Some of the key services include:

- `ScraperService`: Provides methods for managing video collections and playback.
- `DownloadLinkService`: Provides methods for managing download links.
- `PlayListService`: Provides methods for managing playlists.
- `ActorService`: Provides methods for managing actors.
- `GalleryService`: Provides methods for managing galleries.
- `SettingService`: Provides methods for managing settings.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.
