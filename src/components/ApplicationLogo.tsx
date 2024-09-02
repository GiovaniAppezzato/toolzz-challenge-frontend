import { StaticImageData } from 'next/image';
import Image from 'next/image';
import toolzzSm from '@/assets/images/toolzz-sm.webp';
import toolzzXs from '@/assets/images/toolzz-xs.webp';

interface IProps {
  className?: string;
  alt?: string;
  src?: StaticImageData; 
}

export default function ApplicationLogo({ 
  alt = 'Application Logo',
  src = toolzzXs,
  ...rest 
}: IProps) {
  return (
    <Image {...rest} src={src} alt={alt} />
  )
}
