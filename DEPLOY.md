# Instrucciones de Despliegue en Vercel

## Opción 1: Despliegue desde GitHub (Recomendado)

1. **Sube tu código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <tu-repositorio-github>
   git push -u origin main
   ```

2. **Despliega en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta de GitHub
   - Haz clic en "Add New Project"
   - Selecciona tu repositorio
   - Vercel detectará automáticamente Next.js
   - Haz clic en "Deploy"
   - ¡Listo! Tu aplicación estará disponible en una URL como `tu-proyecto.vercel.app`

## Opción 2: Despliegue desde CLI

1. **Instala Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Despliega:**
   ```bash
   vercel
   ```

3. **Sigue las instrucciones en la terminal**

## Características del Despliegue

- ✅ Hosting gratuito
- ✅ HTTPS automático
- ✅ Dominio personalizado opcional
- ✅ Despliegues automáticos desde GitHub
- ✅ CDN global para mejor rendimiento

## Notas

- La aplicación está lista para producción
- No se requiere configuración adicional
- Vercel detectará automáticamente Next.js y configurará todo

