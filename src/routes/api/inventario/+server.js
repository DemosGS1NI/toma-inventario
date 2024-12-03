import { sql } from '@vercel/postgres';  // Importing the sql function from @vercel/postgres
import { config } from 'dotenv';
config(); // Load environment variables from .env file

export async function POST({ request }) {
    const { bodega, ubicacion, productBarcode, quantity, notes } = await request.json();
    
    try {
        // Check if product exists
        const productResult = await sql`
            SELECT * FROM productos WHERE codigo_barras = ${productBarcode};
        `;
        
        if (productResult.rows.length === 0) {
            return {
                status: 400,
                body: { success: false, message: 'Product not found' }
            };
        }

        // Update inventory record
        const updateResult = await sql`
            UPDATE inventarios 
            SET cantidad = ${quantity}, ubicacion = ${ubicacion}, notas = ${notes} 
            WHERE bodega_id = ${bodega} AND producto_id = ${productResult.rows[0].id};
        `;

        if (updateResult.rowCount > 0) {
            return {
                body: { success: true }
            };
        } else {
            return {
                status: 500,
                body: { success: false, message: 'Failed to update inventory' }
            };
        }
    } catch (error) {
        console.error('Error updating inventory:', error);
        return {
            status: 500,
            body: { success: false, message: 'Internal Server Error' }
        };
    }
}
