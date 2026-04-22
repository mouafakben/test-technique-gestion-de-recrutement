import type { Candidature, Status } from '@/types/candidature'

const base_url = import.meta.env.VITE_BASE_PATH || ''

const buildQuery = (params: Record<string, string | number>) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
            query.append(key, String(value))
        }
    })
    return query.toString()
}

export const candidatureRepository = {
    async getAll(params: Record<string, string | number> = {}) {
        const response = await fetch(`${base_url}/candidatures?${buildQuery(params)}`)
        if (!response.ok) throw new Error('Erreur lors du chargement des candidatures')

        return {
            data: await response.json(),
            total: Number(response.headers.get('X-Total-Count')) || 0,
        }
    },

    async getById(id: number): Promise<Candidature> {
        const response = await fetch(`${base_url}/candidatures/${id}`)
        if (!response.ok) throw new Error('Candidature introuvable')
        return response.json()
    },

    async getStatuts(): Promise<Status[]> {
        const response = await fetch(`${base_url}/statuts`)
        if (!response.ok) throw new Error('Erreur lors du chargement des statuts')
        return response.json()
    },

    async create(payload: Partial<Candidature>): Promise<Candidature> {
        const response = await fetch(`${base_url}/candidatures`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error('Erreur lors de la création')
        return response.json()
    },

    async update(id: number, payload: Candidature): Promise<Candidature> {
        const response = await fetch(`${base_url}/candidatures/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error('Erreur lors de la modification')
        return response.json()
    },

    async patch(id: number, payload: Partial<Candidature>): Promise<Candidature> {
        const response = await fetch(`${base_url}/candidatures/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error('Erreur lors de la mise à jour partielle')
        return response.json()
    },

    async remove(id: number): Promise<void> {
        const response = await fetch(`${base_url}/candidatures/${id}`, {
            method: 'DELETE',
        })
        if (!response.ok) throw new Error('Erreur lors de la suppression')
    },
}