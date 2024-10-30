# Chibatá

Únete al cambio de Bogotá, una ecoacción a la vez. Chibatá es una iniciativa que busca contribuir a la reducción de la contaminación en la ciudad de Bogotá, a través de la promoción de la participación de la ciuda

## Requisitos previos

- Node.js >= 20.18
- npm >= 10.8

## Set up

Copia el repositorio en tu máquina local: [chibata_client](https://github.com/rocasdev/chibata_client.git) y posteriormente ejecuta el siguiente comando en la terminal:


```bash
git clone https://github.com/rocasdev/chibata_client.git
cd chibata_client
```

Instala las dependencias del proyecto ejecutando el siguiente comando en la terminal:

```bash
npm install
```



## Ejecución

Para ejecutar el proyecto en modo desarrollo, ejecuta el siguiente comando en la terminal:



```bash
npm run dev
```



### Construcción

Para construir el proyecto, ejecuta el siguiente comando en la terminal:


```bash
npm run build
```


### Deploy

Para desplegar el proyecto, ejecuta el siguiente comando en la terminal:



```bash
npm start
```



## Estructura del Proyecto

La estructura de este proyecto sigue una arquitectura basada en componentes para una mayor escalabilidad y facilidad de mantenimiento.

```plaintext
/chibata_client
  ├── app             # Componentes reutilizables y lógica de la aplicación
    ├── (site)        # Aqui sen encuentran todas las paginas de la aplicacion
      ├── (dashboard) # Aqui se encuentran las paginas del dashboard
        ├── admin     # Aqui se encuentran las paginas del dashboard de administrador
        ├── volunteer # Aqui se encuentran las paginas del dashboard de voluntarios
        ├── organizer # Aqui se encuentran las paginas del dashboard de organizadores
      ├── (web)       # Aqui se encuentran las paginas de la web a las que se accede sin autenticacion
        ├── auth      # Aqui se encuentran las paginas de autenticacion
        ├── support   # Aqui se encuentran el formulario de contacto
  ├── components      # Componentes reutilizables
  ├── lib             # Funciones y utilidades comunes
  ├── public          # Archivos estáticos
  ├── types           # Definiciones de tipos personalizados TypeScript
```


## Tecnologías Utilizadas

- **NextJS:**

- **ShadcnUI:** 

- **Formik y Yup:** 

- **Axios:** Para las peticiones HTTP y la comunicación con el servidor.


## Licencia

Este proyecto está bajo la licencia [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) y no se puede usar para fines comerciales. Por favor, lee la [licencia](LICENSE) para más detalles.
Contacto

## Mas informacion

Para más información sobre la aplicación o el equipo de desarrollo, por favor contáctanos en chibata.app@gmail.com