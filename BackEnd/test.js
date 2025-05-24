import bcrypt from 'bcryptjs';

const generate = async () => {
  const hash = await bcrypt.hash('admin123', 10);
  console.log('Hash:', hash);
};

generate();
