import './specHelper'
import Immutable from 'immutable';
import reducer from '../src/reducers/main';
import { SEARCH, SEARCH_COMPLETE, startSearch, completeSearch } from '../src/actions/search';
import { FETCH_DETAILS, RECEIVE_DETAILS, startDetails, completeDetails} from '../src/actions/detail';

describe('The main reducer', function() {

  it('returns a composed initial state', function() {
    const initialState = Immutable.Map();
    const initialAction = {type: 'init'};
    const result = reducer(initialState, initialAction);

    result.should.be.an.instanceOf(Immutable.Map);
    result.get('search').should.be.an.instanceOf(Immutable.Map);
    result.get('details').should.be.an.instanceOf(Immutable.Map);
    result.get('results').should.be.an.instanceOf(Immutable.List);
  });

});