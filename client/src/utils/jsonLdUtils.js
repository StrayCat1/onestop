import _ from 'lodash'
import moment from 'moment/moment'

// if the input represents a finite number, coerces and returns it, else null
export const toJsonLd = item => {
  const parts = [
    basicToJsonLd(item),
    doiToJsonLd(item),
    thumbnailToJsonLd(item),
    temporalToJsonLd(item)
  ]

  return `{${_.join(_.compact(parts), ',')}
}`
}

export const basicToJsonLd = item => {
  return `
  "@context": "http://schema.org",
  "@type": "Dataset",
  "name": "${item.title}",
  "description": "${item.description}"`
}

export const doiToJsonLd = item => {
  if (item.doi)
  return `
  "alternateName": "${item.doi}",
  "url": "https://accession.nodc.noaa.gov/${item.doi}",
  "sameAs": "https://data.nodc.noaa.gov/cgi-bin/iso?id=${item.doi}"`
}

export const thumbnailToJsonLd = item => {
  if (item.thumbnail)
  return `
  "image": {
    "@type": "ImageObject",
    "url" : "${item.thumbnail}",
    "contentUrl" : "${item.thumbnail}"
  }`
}

export const temporalToJsonLd = item => {
  if (item.beginDate)
  return `
  "temporalCoverage": "${item.beginDate}/${item.endDate}"`
}
