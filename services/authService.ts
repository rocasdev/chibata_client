import axios from 'axios';
import { client } from '@/lib/sanity'; // Cliente de Sanity configurado
import { v2 as cloudinary } from 'cloudinary';

// Configura Cloudinary
cloudinary.config({
  cloud_name: "dinkcwwze",
  api_key: "552853187572332",
  api_secret: "Gi4lizppV3KFo-pxW3KD_YvEM2U",
});

export const registerUser = async (values: any) => {
  // Subir imagen a Cloudinary
  const formData = new FormData();
  formData.append('file', values.image);

  const { data: uploadResponse } = await axios.post(
    `https://api.cloudinary.com/v1_1/dinkcwwze/image/upload`,
    formData
  );

  const imageUrl = uploadResponse.secure_url;
  const relativeUrl = uploadResponse.public_id;

  // Guardar usuario en Sanity
  const userData = {
    _type: 'user',
    name: values.name,
    surname: values.surname,
    email: values.email,
    docType: values.doc_type,
    docNum: values.doc_num,
    phoneNumber: values.phone_number,
    pass: values.pass, // Aquí debes encriptar la contraseña antes de guardarla
    role: {
      _type: 'reference',
      _ref: values.role_id, // Referencia al rol
    },
    profilePhoto: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: relativeUrl,
      },
    },
    relativePhotoUrl: imageUrl,
    state: false,
  };

  await client.create(userData); // Guardar en Sanity

  return userData;
};
