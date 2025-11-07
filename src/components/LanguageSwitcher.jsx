import { useTranslation } from 'react-i18next'
import CustomDropdown from './CustomDropdown'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const value = i18n.language?.startsWith('hi') ? 'hi' : 'en'
  const options = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी' },
  ]

  return (
    <div className="w-36">
      <CustomDropdown
        value={value}
        onChange={(lng) => i18n.changeLanguage(lng)}
        options={options}
        placeholder="Language"
      />
    </div>
  )
}

export default LanguageSwitcher
