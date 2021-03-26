import React from 'react'
import { useTranslation } from 'react-i18next'
import Timer from 'react-compound-timer'

import './style.scss'

export default function Countdown(props) {
    const { t } = useTranslation()
    const { timestamp, done } = props
    return (<div className="countdown">
        {<Timer initialTime={timestamp} direction="backward" checkpoints={[{ time: 0, callback: () => done() }]}>
            <div className="num">
                <Timer.Days />
            </div>
            <div className="unit">{t('common.days')}</div>
            <div className="num">
                <Timer.Hours />
            </div>
            <div className="unit">{t('common.hours')}</div>
            <div className="num">
                <Timer.Minutes />
            </div>
            <div className="unit">{t('common.minutes')}</div>
            <div className="num">
                <Timer.Seconds />
            </div>
            <div className="unit">{t('common.seconds')}</div>
        </Timer>}

    </div >)
}