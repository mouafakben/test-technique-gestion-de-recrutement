
type Competences = 'Vue.js' | 'React' | 'TypeScript' | 'Node.js' | 'Pinia' | 'Nuxt.js' | 'MongoDB' | 'PostgreSQL' | 'Docker' | 'TailwindCSS';

export interface Poste {
    id: number;
    titre: string;
    description: string;
    competencesRequises: string[];
}

export interface Competence {
    id: number;
    nom: string;
    categorie: string;
}