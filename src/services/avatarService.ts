import md5 from 'crypto-js/md5';

export const getGravatarUrl = async (email: string): Promise<string | null> => {
  if (!email) return null;
  
  const hash = md5(email.trim().toLowerCase()).toString();
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=404&s=200`;
  
  try {
    const response = await fetch(gravatarUrl);
    return response.ok ? gravatarUrl.replace('d=404', 'd=identicon') : null;
  } catch {
    return null;
  }
};

export const getRandomUserAvatar = async (): Promise<string> => {
  try {
    const response = await fetch('https://randomuser.me/api/?inc=picture');
    const data = await response.json();
    return data.results[0]?.picture?.large || 
           'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=face';
  } catch {
    return 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=face';
  }
};