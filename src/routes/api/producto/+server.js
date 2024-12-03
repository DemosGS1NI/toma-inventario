import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
export async function GET({ url }) {
    const bodega = url.searchParams.get('bodega');
    const marca = url.searchParams.get('marca');
    const codigoBarra = url.searchParams.get('codigo_barra');

    if (!bodega || !marca || !codigoBarra) {
        return new Response(
            JSON.stringify({ success: false, message: 'Bodega, Marca, and Codigo de Barra are required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const result = await sql`
            SELECT numero_parte, descripcion, inventario_fisico, fecha_inventario, incidencias 
            FROM inventario 
            WHERE bodega = ${bodega} AND marca = ${marca} AND codigo_barras = ${codigoBarra}
        `;
        
        if (result.rows.length > 0) {
            return new Response(
                JSON.stringify({ product: result.rows }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        } else {
            return new Response(
                JSON.stringify({ success: false, message: 'Product not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error fetching product' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
