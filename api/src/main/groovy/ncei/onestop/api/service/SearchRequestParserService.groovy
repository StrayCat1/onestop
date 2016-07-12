package ncei.onestop.api.service

import groovy.json.JsonOutput
import groovy.util.logging.Slf4j
import org.elasticsearch.common.geo.ShapeRelation
import org.elasticsearch.common.geo.builders.ShapeBuilder
import org.elasticsearch.common.xcontent.XContentType
import org.elasticsearch.index.query.QueryBuilder
import org.elasticsearch.index.query.QueryBuilders
import org.springframework.stereotype.Service

@Slf4j
@Service
class SearchRequestParserService {

    public SearchRequestParserService() {}


    public QueryBuilder parseSearchRequest(Map params) {

        log.debug("Queries: ${params.queries}")
        log.debug("Filters: ${params.filters}")

        def query = assembleQuery(params.queries)
        def filter = assembleFilter(params.filters)

        /*
        query
            bool
                filter
                    {filters}
                must
                    {queries}
         */
        def completeQuery = QueryBuilders.boolQuery().filter(filter).must(query)
        completeQuery
    }


    private QueryBuilder assembleFilter(List<Map> filters) {

        /*For filters:
             * union: A | B | A & B; intersection: A & B
             - union with bool > must > bool > should [] for multiple selections on same term
             - union of multiple unions is  bool > must >> bool > should []
                    -- (does this mean a match must come from each nested filter?)
             - intersection probably bool > must > bool > must (single term)
        */

        def builder = QueryBuilders.boolQuery()
        if (!filters) { return builder }

        def groupedFilters = filters.groupBy { it.type }

        // Temporal filters:
        groupedFilters.datetime.each {
            if (it.before) {
                builder.must(QueryBuilders.rangeQuery('temporalBounding.beginDate').lte(it.before))
            }
            if (it.after) {
                builder.must(QueryBuilders.rangeQuery('temporalBounding.endDate').gte(it.after))
            }
        }

        // Spatial filters:
        groupedFilters.geometry.each {
            // it's a little silly to convert back to json string, but it's the easiest
            // and most flexible way for the elasticsearch api to parse a request from it
            def json = JsonOutput.toJson(it.geometry)
            def parser = XContentType.JSON.xContent().createParser(json)
            parser.nextToken() // need to advance to the first token before parsing for some reason...
            def shape = ShapeBuilder.parse(parser)
            def relation = ShapeRelation.getRelationByName(it.relation ?: 'intersects')

            builder.must(QueryBuilders.geoShapeQuery("spatialBounding", shape, relation))
        }

        // Facet filters:
        groupedFilters.facet.each {
            // TODO
            builder.must(QueryBuilders.termsQuery(it.name, it.values))
        }

        return builder
    }


    private QueryBuilder assembleQuery(List<Map> queries) {
        def builder = QueryBuilders.boolQuery()
        if (!queries) { return builder }

        def groupedQueries = queries.groupBy { it.type }

        groupedQueries.queryText.each {
            builder.must(QueryBuilders.queryStringQuery(it.value))
        }

        return builder
    }

}

