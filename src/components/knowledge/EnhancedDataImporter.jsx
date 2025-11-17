/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Enhanced Data Importer with Multiple Sources               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from "@/api/base44Client";

export class EnhancedDataImporter {
  // Wikipedia Import
  static async importFromWikipedia(query) {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    );
    const data = await response.json();
    
    return [{
      title: data.title,
      content: data.extract,
      url: data.content_urls?.desktop?.page,
      source: "Wikipedia",
      metadata: {
        thumbnail: data.thumbnail?.source,
        extract_html: data.extract_html
      }
    }];
  }

  // arXiv Import
  static async importFromArXiv(query) {
    const searchUrl = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=10`;
    const response = await fetch(searchUrl);
    const xmlText = await response.text();
    
    const entries = xmlText.match(/<entry>([\s\S]*?)<\/entry>/g) || [];
    
    return entries.slice(0, 5).map(entry => {
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const summary = entry.match(/<summary>(.*?)<\/summary>/)?.[1] || "";
      const link = entry.match(/<id>(.*?)<\/id>/)?.[1] || "";
      const authors = [...entry.matchAll(/<name>(.*?)<\/name>/g)].map(m => m[1]);
      const published = entry.match(/<published>(.*?)<\/published>/)?.[1] || "";
      
      return {
        title: title.trim(),
        content: summary.trim(),
        url: link,
        source: "arXiv",
        metadata: {
          authors: authors.join(", "),
          published_date: published
        }
      };
    });
  }

  // PubMed Import
  static async importFromPubMed(query) {
    // Search for article IDs
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=5&retmode=json`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    const ids = searchData.esearchresult?.idlist || [];
    if (ids.length === 0) return [];
    
    // Fetch summaries for IDs
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
    const summaryResponse = await fetch(summaryUrl);
    const summaryData = await summaryResponse.json();
    
    return ids.map(id => {
      const article = summaryData.result[id];
      return {
        title: article.title || "Unknown",
        content: article.source || "No abstract available",
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        source: "PubMed",
        metadata: {
          authors: article.authors?.map(a => a.name).join(", ") || "Unknown",
          journal: article.fulljournalname,
          pub_date: article.pubdate
        }
      };
    });
  }

  // OpenStreetMap Import
  static async importFromOpenStreetMap(query) {
    const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
    const response = await fetch(searchUrl, {
      headers: { 'User-Agent': 'DruideOmega/1.0' }
    });
    const data = await response.json();
    
    return data.map(place => ({
      title: place.display_name,
      content: `Type: ${place.type}\nClass: ${place.class}\nCoordinates: ${place.lat}, ${place.lon}\nAddress: ${JSON.stringify(place.address, null, 2)}`,
      url: `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=15/${place.lat}/${place.lon}`,
      source: "OpenStreetMap",
      metadata: {
        latitude: place.lat,
        longitude: place.lon,
        place_id: place.place_id,
        type: place.type
      }
    }));
  }

  // Project Gutenberg Import (via search)
  static async importFromGutenberg(query) {
    const searchUrl = `https://gutendex.com/books?search=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    return (data.results || []).slice(0, 5).map(book => ({
      title: book.title,
      content: `Author(s): ${book.authors.map(a => a.name).join(", ")}\nLanguages: ${book.languages.join(", ")}\nDownload Count: ${book.download_count}\nSubjects: ${book.subjects.slice(0, 5).join(", ")}`,
      url: book.formats['text/html'] || book.formats['text/plain; charset=utf-8'] || `https://www.gutenberg.org/ebooks/${book.id}`,
      source: "Project Gutenberg",
      metadata: {
        gutenberg_id: book.id,
        authors: book.authors.map(a => a.name),
        download_count: book.download_count
      }
    }));
  }

  // DBpedia SPARQL Import
  static async importFromDBpedia(query) {
    const sparqlQuery = `
      SELECT DISTINCT ?subject ?label ?abstract WHERE {
        ?subject rdfs:label ?label .
        ?subject dbo:abstract ?abstract .
        FILTER (regex(?label, "${query}", "i"))
        FILTER (lang(?label) = 'en')
        FILTER (lang(?abstract) = 'en')
      }
      LIMIT 5
    `;
    
    const url = `https://dbpedia.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    
    return (data.results?.bindings || []).map(binding => ({
      title: binding.label.value,
      content: binding.abstract.value,
      url: binding.subject.value,
      source: "DBpedia",
      metadata: {
        uri: binding.subject.value
      }
    }));
  }

  // Generic import and save
  static async importAndSave(sourceType, query, tags = []) {
    let results = [];
    
    switch (sourceType) {
      case 'wikipedia':
        results = await this.importFromWikipedia(query);
        break;
      case 'arxiv':
        results = await this.importFromArXiv(query);
        break;
      case 'pubmed':
        results = await this.importFromPubMed(query);
        break;
      case 'openstreetmap':
        results = await this.importFromOpenStreetMap(query);
        break;
      case 'gutenberg':
        results = await this.importFromGutenberg(query);
        break;
      case 'dbpedia':
        results = await this.importFromDBpedia(query);
        break;
      default:
        throw new Error(`Source type ${sourceType} not supported`);
    }

    // Save to database
    const savedItems = [];
    for (const item of results) {
      const saved = await base44.entities.KnowledgeBase.create({
        name: `${item.source}: ${item.title}`,
        description: `Imported from ${item.source}`,
        content: item.content,
        source_url: item.url,
        tags: [item.source.toLowerCase(), query.toLowerCase(), ...tags],
        category: "external_data",
        version: "1.0",
        active: true,
        metadata: {
          ...item.metadata,
          import_date: new Date().toISOString(),
          source: item.source,
          query: query
        }
      });
      savedItems.push(saved);
    }

    return savedItems;
  }
}