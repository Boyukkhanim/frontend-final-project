import { useTranslation } from 'react-i18next'
import type { LocalizedField } from './useGameAccessories'

export const useLocalizedField = () => {
    const { i18n } = useTranslation()

    const localize = (field: LocalizedField | undefined): string => {
        if (!field) return ''
        const lang = i18n.language.split('-')[0] // "az-AZ" → "az"
        return field[lang] ?? field['en'] ?? Object.values(field)[0] ?? ''
    }

    return { localize }
}