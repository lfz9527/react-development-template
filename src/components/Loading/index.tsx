import { cn } from '@/utils/common'
import LoadingSvg from '~icons/local-icons/loading'
import styles from './index.module.css'

type Props = Global.ElAttrs<HTMLDivElement> & {
  size?: number | string
}

export default function Loading({ className, size = 24, ...props }: Props) {
  return (
    <div
      className={cn(styles['loading'], className)}
      style={{}}
      {...props}
    >
      <LoadingSvg
        width={size}
        height={size}
      />
    </div>
  )
}
