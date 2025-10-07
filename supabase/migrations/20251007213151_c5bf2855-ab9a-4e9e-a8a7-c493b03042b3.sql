-- Crear políticas RLS para el bucket avatars

-- Política para permitir a los usuarios subir sus propias imágenes
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para permitir a los usuarios actualizar sus propias imágenes
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para permitir a los usuarios eliminar sus propias imágenes
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para permitir que todos vean las imágenes públicas
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');