import Image from 'next/image';
import toolzzSm from '@/assets/images/toolzz-sm.webp';

interface IProps {
  className?: string;
  alt?: string;
}

export default function ApplicationLogo({ 
  alt = 'Application Logo',
  ...rest 
}: IProps) {
  return (
    <Image {...rest} src={toolzzSm} alt={alt} />
  )
}
