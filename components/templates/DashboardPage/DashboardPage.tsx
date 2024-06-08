import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getBestsellersOrNewPartsFx } from '@/app/api/guitarParts'
import BrandsSlider from '@/components/modules/DashboardPage/BrandsSlider'
import { IGuitarParts } from '@/types/guitarparts'
import styles from '@/styles/dashboard/index.module.scss'
import { useStore } from 'effector-react'
import { $mode } from '@/context/mode'
import DashboardSlider from '@/components/modules/DashboardPage/DashboardSlider'
import { $shoppingCart } from '@/context/shopping-cart'
import { AnimatePresence, motion } from 'framer-motion'
import CartAlert from '@/components/modules/DashboardPage/CartAlert'

const DashboardPage = () => {
  const [newParts, setNewParts] = useState<IGuitarParts>({} as IGuitarParts)
  const [bestsellers, setBestsellers] = useState<IGuitarParts>(
    {} as IGuitarParts
  )
  const [spinner, setSpinner] = useState(false)
  const shoppingCart = useStore($shoppingCart)
  const [showAlert, setShowAlert] = useState(!!shoppingCart.length)
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  useEffect(() => {
    loadGuitarParts()
  }, [])

  useEffect(() => {
    if (shoppingCart.length) {
      setShowAlert(true)
      return
    }

    setShowAlert(false)
  }, [shoppingCart.length])

  const loadGuitarParts = async () => {
    try {
      setSpinner(true)
      const bestsellers = await getBestsellersOrNewPartsFx(
        '/guitar-parts/bestsellers'
      )
      const newParts = await getBestsellersOrNewPartsFx('/guitar-parts/new')

      setBestsellers(bestsellers)
      setNewParts(newParts)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }

  const closeAlert = () => setShowAlert(false)

  return (
    <section className={styles.dashboard}>
      <div className={`container ${styles.dashboard__container}`}>
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${styles.dashboard__alert} ${darkModeClass}`}
            >
              <CartAlert
                count={shoppingCart.reduce(
                  (defaultCount, item) => defaultCount + item.count,
                  0
                )}
                closeAlert={closeAlert}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className={styles.dashboard__brands}>
          <BrandsSlider />
        </div>
        <h2 className={`${styles.dashboard__title} ${darkModeClass}`}>
          Guitar Shop
        </h2>
        <div className={styles.dashboard__parts}>
          <h3 className={`${styles.dashboard__parts__title} ${darkModeClass}`}>
            Хиты продаж
          </h3>
          <DashboardSlider items={bestsellers.rows || []} spinner={spinner} />
        </div>
        <div className={styles.dashboard__parts}>
          <h3 className={`${styles.dashboard__parts__title} ${darkModeClass}`}>
            Новинки
          </h3>
          <DashboardSlider items={newParts.rows || []} spinner={spinner} />
        </div>
        <div className={styles.dashboard__about}>
          <h3
            className={`${styles.dashboard__parts__title} ${styles.dashboard__about__title} ${darkModeClass}`}
          >
            О компании
          </h3>
          <p className={`${styles.dashboard__about__text} ${darkModeClass}`}>
            Если вы ищете идеальную гитару для себя или ваших близких,
            обращайтесь к нам с уверенностью. Мы гарантируем высокое качество
            инструментов, профессиональный сервис и приятное обслуживание. Мы
            гордимся тем, что помогаем нашим клиентам раскрыть свой музыкальный
            потенциал и наслаждаться игрой на гитаре.
          </p>
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
