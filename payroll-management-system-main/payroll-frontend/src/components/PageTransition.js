import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
