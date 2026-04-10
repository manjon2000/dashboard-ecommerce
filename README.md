# Dashboard

## Requeriments

### Atoms Components:
Los atomos son componentes de presentación encargados de la interfaz de usuario.

| Componente | Variantes y Estados | Responsabilidad Tecnica |
| :--- | :--- | :--- |
| Button | Primary, Secondary, Outline, Loading | Gestion de eventos de click y estados visuales. |
| Input Text | Active, ReadOnly, Disabled, Error | Implementacion de ControlValueAccessor para formularios. |
| Input Select | Active, ReadOnly, Disabled | Manejo de opciones y navegacion por teclado via CDK. |
| Alert | Success, Information, Error | Notificaciones accesibles con roles ARIA especificos. |
| Table | Headers, Body, Empty State | Proyeccion de contenido dinamico y estados de carga. |
| Paginator | Default, Active, Disabled | Emision de eventos de paginacion (indice y tamaño). |
| Filter | Input, Chip, Clear | Captura de criterios de busqueda para la tabla. |


#### Tests
* UI y Estados: Validar que se aplican las clases CSS correctas segun la variante definida.
* Accesibilidad: Verificar navegacion mediante Tab/Enter y etiquetas para lectores de pantalla.
* Seguridad: Validar que los valores de entrada no ejecuten scripts (XSS) al ser renderizados.
* Formularios: Comprobar la sincronizacion bidireccional entre el componente y el FormControl.

### Molecules Components
Las moleculas combinan varios atomos para crear unidades funcionales mas complejas.

#### SmartTable
Componente de alta complejidad que orquesta la visualizacion de datos.
* **Composicion:** Filters + Table + Paginator + Alert.
* **Logica:** Centraliza el estado de los filtros, el ordenamiento y la paginacion actual.

#### Tests para Moleculas
* **Integracion de Filtros:** Verificar que la tabla reacciona ante cambios en el componente de filtros.
* **Flujo de Paginacion:** Validar que el cambio de pagina dispare las peticiones correctas al servicio.
* **Estado Vacio:** Confirmar que se muestra el mensaje informativo correcto cuando no existen registros.
* **Consistencia de Datos:** Asegurar que los datos mostrados cumplen con el esquema de validacion Zod.

---

### Features:
#### Categories:
- All:
    - Filtros.
    - Tabla con todas las categorías.
    - Paginación.
- Edit:
    - AlertsService.
    - Sección informativa sobre la categoría (Details).
    - Formulario
        - Input text (Nombre).
        - Input select (Select parent categories).
        - Button (Primary) submit.

#### Tags:
- All
    - Filtros.
    - Tabla con todas las tags.
    - Paginación.
- Edit
    - AlertsService.
    - Sección informativa sobre la tag (Details).
    - Formulario
        - Input text.
        - Button (Primary) submit.


### Tests:
- Filtros.
- Tabla con datos.
- Tabla sin datos.
- Paginación.
- Formulario con errores por campo y comprobar si enviamos o no y los datos sean identicos a los que pusimos.
- Validación XSS en los campos del formulario.



Entendido. Vamos a limpiar el formato eliminando iconos y caracteres especiales, manteniendo una estructura profesional, minimalista y fácil de leer en cualquier editor de Markdown.

Aquí tienes la versión refinada para tu **README.md**:

#### Tests para Atomos
* **UI y Estados:** Validar que se aplican las clases CSS correctas segun la variante definida.
* **Accesibilidad:** Verificar navegacion mediante Tab/Enter y etiquetas para lectores de pantalla.
* **Seguridad:** Validar que los valores de entrada no ejecuten scripts (XSS) al ser renderizados.
* **Formularios:** Comprobar la sincronizacion bidireccional entre el componente y el FormControl.

---

### Molecules Components

### Estandares de Calidad y Seguridad
* **Cumplimiento WCAG:** Relacion de contraste minima de 4.5:1 y soporte completo para tecnologias de asistencia.
* **Sanitizacion de Datos:** Uso de mecanismos nativos de Angular para la prevencion de inyecciones de codigo.
* **Rendimiento:** Uso de ChangeDetectionStrategy.OnPush para minimizar ciclos de deteccion de cambios innecesarios.
* **Tipado Estricto:** Validacion en tiempo de ejecucion de respuestas de API mediante esquemas Zod.