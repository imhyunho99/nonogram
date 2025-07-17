import axios from 'axios';

export async function uploadOriginImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axios.post('/image/origin', formData);
  return res.data;
}

export async function generateNonogram(origin_id, size) {
  const res = await axios.post('/image/create/', {
    origin_id,
    size,
  });
  return res.data;
}
