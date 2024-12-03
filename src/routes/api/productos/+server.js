import { pool } from '@vercel/postgres';

export async function GET({ query }) {
    const { barcode } = query;
    const { rows } = await pool.query('SELECT * FROM productos WHERE codigo_barras = $1', [barcode]);
    return {
        body: rows[0] || {}  // Return the product details if found
    };
}

