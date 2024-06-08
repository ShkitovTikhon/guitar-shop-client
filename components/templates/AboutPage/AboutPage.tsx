/* eslint-disable @next/next/no-img-element */
import { useStore } from 'effector-react'
import { $mode } from '@/context/mode'
import styles from '@/styles/about/index.module.scss'

const AboutPage = () => {
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  return (
    <section className={styles.about}>
      <div className="container">
        <h2 className={`${styles.about__title} ${darkModeClass}`}>
          О компании
        </h2>
        <div className={styles.about__inner}>
          <div className={`${styles.about__info} ${darkModeClass}`}>
            <p>
            Наши гитары - это не просто музыкальные инструменты, они созданы с любовью и страстью к музыке. Мы предлагаем широкий выбор гитар различных брендов и моделей, чтобы помочь каждому музыканту найти идеальный инструмент для самовыражения.

            </p>
            <p>
            Наши специалисты имеют богатый опыт в области музыкальных инструментов и всегда готовы помочь вам с выбором гитары, а также с консультацией по уходу за инструментом. Мы стремимся к тому, чтобы наши клиенты были довольны качеством обслуживания и продукции.

            </p>
          </div>
          <div className={`${styles.about__img} ${styles.about__img__top}`}>
            <img src="/img/about-img.png" alt="image-1" />
          </div>
          <div className={`${styles.about__img} ${styles.about__img__bottom}`}>
            <img src="/img/about-img-2.png" alt="image-2" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPage
