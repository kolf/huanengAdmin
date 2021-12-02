import axios from '@/util/axios';

export async function getVcode() {
  try {
    const res = await axios.get(`api/auth/captchaImage`);
    return res.data;
  } catch (error) {
    return null;
  }
}
