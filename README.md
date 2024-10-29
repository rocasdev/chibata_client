# Chibatá

Únete al cambio de Bogotá, una ecoacción a la vez. Chibatá es una iniciativa que busca contribuir a la reducción de la contaminación en la ciudad de Bogotá, a través de la promoción de la participación ciudadana en la conservación del medio ambiente.

## Requisitos previos

- Node.js >= 20.18
- npm >= 10.8

## Set up

Copia el repositorio en tu máquina local:

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
 ├── app                  # Componentes reutilizables y lógica de la aplicación
 ├── (site)              # Aquí se encuentran todas las páginas de la aplicación
 ├── (dashboard)         # Aquí se encuentran las páginas del dashboard
 ├── admin               # Aquí se encuentran las páginas del dashboard de administrador
 ├── volunteer           # Aquí se encuentran las páginas del dashboard de voluntarios
 ├── organizer           # Aquí se encuentran las páginas del dashboard de organizadores
 ├── (web)              # Aquí se encuentran las páginas de la web a las que se accede sin autenticación
 ├── auth               # Aquí se encuentran las páginas de autenticación
 ├── support            # Aquí se encuentra el formulario de contacto
 ├── components         # Componentes reutilizables
 ├── lib                # Funciones y utilidades comunes
 ├── public             # Archivos estáticos
 └── types              # Definiciones de tipos personalizados TypeScript
```

## Tecnologías Utilizadas

- **Next.js:** Framework de React que permite la creación de aplicaciones web full-stack con renderizado híbrido, optimización automática y enrutamiento integrado.
- **Shadcn UI:** Biblioteca de componentes de interfaz de usuario reutilizables y personalizables construidos con Radix UI y Tailwind CSS.
- **Formik:** Biblioteca para la gestión de formularios en React que simplifica la validación, el manejo de errores y el envío de formularios.
- **Yup:** Biblioteca de validación de esquemas que trabaja en conjunto con Formik para proporcionar validaciones robustas y tipadas.
- **Axios:** Cliente HTTP basado en promesas para realizar peticiones al servidor, con soporte para interceptores y transformación automática de datos JSON.
- **TypeScript:** Superset de JavaScript que añade tipado estático opcional y otras características avanzadas para mejorar la calidad del código.
- **Tailwind CSS:** Framework de CSS utilidad-primero para la construcción rápida de interfaces modernas y responsivas.
- **Framer Motion:** Biblioteca para crear animaciones fluidas y gestos interactivos en React, proporcionando una API declarativa para animaciones complejas.
- **ESLint:** Herramienta de análisis de código estático que ayuda a mantener un código consistente y libre de errores, con reglas personalizables para TypeScript y React.
- **Mapbox:** Plataforma de mapas y servicios de localización que proporciona herramientas para integrar mapas interactivos y funcionalidades de geolocalización.
- **Swiper.js:** Framework moderno de touch slider con transiciones aceleradas por hardware y comportamiento nativo excepcional, ideal para crear carruseles y galerías interactivas.

## Características Principales

- Arquitectura modular y escalable
- Sistema de autenticación robusto
- Interfaz de usuario moderna y responsiva
- Gestión eficiente de estado
- Validación de formularios avanzada
- Integración con API REST
- Soporte para múltiples roles de usuario

## Licencia

Este proyecto está bajo la licencia [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) y no se puede usar para fines comerciales. Por favor, lee la [licencia](LICENSE) para más detalles.

## Contacto y Soporte

Para más información sobre la aplicación o el equipo de desarrollo, por favor contáctanos en chibata.app@gmail.com

## Contribución

¿Quieres contribuir al proyecto? ¡Genial! Por favor, sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Estado del Proyecto

El proyecto se encuentra en desarrollo activo. Estamos trabajando continuamente para mejorar la aplicación y añadir nuevas características.