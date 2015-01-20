/* 
 * (C) 2015 Muthiah Annamalai
 * 
 * Translator for Tamilscript : we convert the code from native to the 
 * basic java script in text form.
 */
var token = { '(' : 'OPEN_BRACKET',
              ')' : 'CLOSE_BRACKET',
              '[' : 'OPEN_SQR',
              ']' : 'CLOSE_SQR',
              '{' : 'OPEN_BRACE',
              '}' : 'CLOSE_BRACE',
              '+' : 'PLUS',
              '-' : 'MINUS',
              '/' : 'DIV',
              '%' : 'MOD',
              '*' : 'PROD',
              '^' : 'XOR',
              '&' : 'AND',
              '=' : 'EQUAL',
              '.' : 'DOT',
              '==' : 'EQUALITY',
              ',' : 'COMMA',
              ';' : 'SEMICOLON',
              ':' : 'COLON',
              '.' : 'PERIOD',
              numeric : 'NUMERIC',
              string : 'STRING'
            };

var tamilscript = { 
     tamilLexerClass : function () {
        return {
            mTokens : [],
            mInput  : '',
            lexer : function ( inString ) {
                var open_close = ['[',']','(',')','{','}'];
                var separators = ['[',']','(',')','{','}','+','-','/','%','^','*','=','==',',',':',';'];
                var self = this;
                self.mInput = inString;
        
                var i = 0;
                var curr = '';
                while( i < inString.length ) {
                    //sidestep the spaces
                    while( inString[i].trim() == '' && i < inString.length ) {
                        i = i + 1;
                    }
                    if ( i == inString.length )
                        break;
                    
                    // collect the chunk
                    read = false;
                    while( (inString[i].trim() != '') && i < inString.length ) {
                        if (separators.indexOf(inString[i]) >= 0) {
                            if ( curr.length == 0 ) {
                                read = true;
                                curr = inString[i];
                            }
                            break;
                        }
                        read = true;
                        curr = curr + inString[i];
                        i = i + 1;
                        read = false;
                    }
                    if (read) {
                    } else {
                        i = i - 1;
                    }
                    if ( curr.length > 0 ) 
                        console.log('Logging token => '+curr);
                    // classify and save token
                    if ( $.isNumeric( curr ) ) {
                        self.mTokens.push( [ curr, token.numeric ] );
                    } else if ( open_close.indexOf( curr ) >= 0 ) {
                        self.mTokens.push( [ curr, token[curr] ] );
                    } else if ( separators.indexOf( curr ) >= 0 ) {
                        self.mTokens.push( [ curr, token[curr]] );
                    } else if ( curr.length > 0 ) {
                        self.mTokens.push( [ curr, token.string ] );
                    }
                    curr = ''; //reset
                    i = i + 1;
                }
            }
        }
    },
    tamilTransformer : function( lexer ) {
        return {
            mLexer : lexer,
            generate : function () {

            }
        }
    },
    parse : function ( src, res ) {
            var lexer = new tamilscript.tamilLexerClass();
            lexer.lexer( $(src).val() );
            var itr = 0;
            var output = '';
            
            $(res).val( $(src).val().length + ' characters wide =>');
            
            while( itr < lexer.mTokens.length ) {
                console.log(itr);
                var tok = lexer.mTokens[itr];
                output = output + tok[0] + ':' + tok[1] + '\n';
                itr = itr + 1;
           }
         
//            $(res).val( output );
            console.log( 'Output => '+output );
            return 0;
    }
}
