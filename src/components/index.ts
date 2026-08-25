// Punto di ingresso unico dei componenti.
// Importa da qui: `import { Button, Card } from '@/components'`.

// --- fondamentali ---
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './Button'
export { Input, type InputProps } from './Input'
export { Select, type SelectProps, type SelectOption } from './Select'
export { Checkbox, type CheckboxProps } from './Checkbox'
export { RadioGroup, type RadioGroupProps, type RadioOption } from './Radio'
export { QuantityStepper, type QuantityStepperProps } from './QuantityStepper'
export { Badge, type BadgeProps, type BadgeTone } from './Badge'
export { Tag, type TagProps } from './Tag'
export { Card, type CardProps } from './Card'
export { Divider, type DividerProps } from './Divider'
export { Accordion, type AccordionProps, type AccordionItem } from './Accordion'
export { Tabs, type TabsProps, type TabItem } from './Tabs'
export { Tooltip, type TooltipProps } from './Tooltip'
export { Modal, type ModalProps } from './Modal'
export { Toast, ToastStack, type ToastProps, type ToastTone } from './Toast'

// --- specifici del brand ---
export { Marquee, type MarqueeProps } from './Marquee'
export { DoseSeal, type DoseSealProps } from './DoseSeal'
export { WeekTimeline, type WeekTimelineProps } from './WeekTimeline'
export { StickPack, type StickPackProps } from './StickPack'
export { ProductCard, type ProductCardProps } from './ProductCard'
export { PriceTiers, type PriceTiersProps, type PriceTier } from './PriceTiers'
export { ReviewCard, type ReviewCardProps } from './ReviewCard'
export { FaqAccordion, type FaqAccordionProps } from './FaqAccordion'
export { StickyAddToCart, type StickyAddToCartProps } from './StickyAddToCart'
export { TrustRow, type TrustRowProps, type TrustItem } from './TrustRow'
export { IngredientPanel, type IngredientPanelProps, type IngredientRow } from './IngredientPanel'
export { SectionHeader, type SectionHeaderProps } from './SectionHeader'
export { BrandOverview, type BrandOverviewProps } from './BrandOverview'
export { Hero, type HeroProps } from './Hero'

// --- layout ---
export { Container, type ContainerProps } from './Container'
export { Grid, type GridProps } from './Grid'
export { Stack, type StackProps } from './Stack'
export { Section, type SectionProps, type SectionTone } from './Section'
