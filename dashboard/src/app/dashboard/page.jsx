'use client'

import { motion } from 'framer-motion'
import link from 'next/link'


export default function DashBoardAdmin() {
    return (<>
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
        >
        </motion.div>




    </>)

}