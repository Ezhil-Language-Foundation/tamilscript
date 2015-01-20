/* 
 * (C) 2015 Muthiah Annamalai
 * This file is part of Tamilscript project.
 *  
 * Translator for Tamilscript : we convert the code from native to the 
 * basic java script in text form.
 */

var tamilscript = (function() {
    return {
        spaces : function ( count ) {
                    var ret = ' ';
                    if (count <= 0 ) {
                        return '';
                    }
                    while( ret.length < count ) {
                        ret = ret + ret;
                    }
                    return ret.substring(0,count);
                },
        whitespace : ['\r\n','\n','\t',' '],
        whitespace_line : ['\r\n','\n'],
        keyword : { 'ஆனால்' : 'if',
                    'இல்லைஆனால்' : 'else if',
                    'இல்லை' : 'else',
                    'ஆக' : 'for',
                    'வரை' : 'while',
                    'நிரல்பாகம்' : 'function',
                    'நிறுத்து':'break',
                    'தொடர்':'continue',
                    'மாரி':'var',
                    'பின்கொடு':'return'
                  },
        relational : {
                 '>=' : 'GTE',
                 '<=' : 'LTE',
                 '>'  : 'GT',
                 '<'  : 'LT',
                 '==' : 'EQUAL'
                 },
        logical : {
                 '==' : 'EQUAL',
                 '!=' : 'NOTEQUAL',
                 '!'  : 'NOT',
                 '^'  : 'XOR',
                 '&'  : 'AND' },
        /* token constant */
        token : { '(' : 'OPEN_BRACKET',
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
                  '=' : 'ASSIGN',
                  '.' : 'DOT',
                  ',' : 'COMMA',
                  ';' : 'SEMICOLON',
                  ':' : 'COLON',
                  '.' : 'PERIOD',
                  '!' : 'NOT',
                  numeric : 'NUMERIC',
                  string : 'STRING',
                  keyword : 'KEYWORD',
                  logical : 'LOGICAL',
                  comment : 'COMMENT',
                  identifier:'ID'
                },
         /* Tamil Lexer Class */
         tamilLexerClass : function () {
            return {
                mTokens : [],
                mInput  : '',
                lexer : function ( inString ) {
                    var open_close = ['[',']','(',')','{','}'];
                    var separators = ['[',']','(',')','{','}','+','-','/','%','^','*','=','==',',',':',';','.'];
                    var L = 1, C = 1, L_offset = 0; // position in stream
                    var self = this;
                    self.mInput = inString;
            
                    var i = 0;
                    var curr = '';
                    while( i < inString.length ) {
                        // sidestep the spaces
                        while(  i < inString.length && (inString[i].trim() == '') ) {
                            if ( tamilscript.whitespace_line.indexOf(inString[i]) >= 0 ) {
                                L = L + 1;
                                L_offset = i;
                            }
                            i = i + 1;
                        }
                        
                        // scan 1-line comment
                        L_offset = i;
                        if( (i+1) < inString.length && inString[i] == '/' && inString[i+1] == '/' ) {
                            i = i + 2;
                            curr = '//';
                            while( i < inString.length && inString[i] !='\n') {
                                curr = curr + inString[i];
                                i = i + 1;
                            }
                            C = i - L_offset - curr.length; //beginning of token
                            self.mTokens.push( [ curr, tamilscript.token.comment, L, C] );
                            L = L + 1;
                            curr = '';
                            continue;
                        }
                        
                        // scan 1-line strings
                        L_offset = i;
                        if ( inString[i] == '\'' || inString[i] == '"') {
                            curr = inString[i];
                            quote = inString[i];
                            prev = inString[i];
                            i = i + 1;
                            while( i < inString.length && (prev == '\\' || inString[i] != quote ) ) {
                                curr = curr + inString[i];
                                prev = inString[i];
                                i = i + 1;
                            }
                            C = i - L_offset - curr.length;
                            self.mTokens.push( [ curr, tamilscript.token.identifier, L, C] );
                            curr = '';
                        }
                        
                        if ( i >= inString.length )
                            break;
                        
                        // collect the chunk
                        read = false;
                        while( (inString[i].trim() != '') && i < inString.length ) {
                            if (separators.indexOf(inString[i]) >= 0) {
                                if ( !$.isNumeric(curr) || inString[i] != '.') {
                                    if ( curr.length == 0 ) {
                                        read = true;
                                        curr = inString[i];
                                    }
                                    break;
                                }
                            }
                            read = true;
                            curr = curr + inString[i];
                            i = i + 1;
                            read = false;
                        }
                        if (!read) {
                            i = i - 1;
                        }
                        C = i - L_offset - curr.length; //beginning of token
                        if ( curr.length > 0 ) 
                            console.log('Logging token => '+curr);
                        // classify and save token
                        if ( $.isNumeric( curr ) ) {
                            self.mTokens.push( [ curr, tamilscript.token.numeric, L, C ] );
                        } else if ( open_close.indexOf( curr ) >= 0 ) {
                            self.mTokens.push( [ curr, tamilscript.token[curr], L, C ] );
                        } else if ( separators.indexOf( curr ) >= 0 ) {
                            self.mTokens.push( [ curr, tamilscript.token[curr], L, C] );
                        } else if ( curr.length > 0 ) {
                            if ( tamilscript.keyword[curr] )
                                self.mTokens.push( [curr, tamilscript.keyword[curr]+':'+tamilscript.token.keyword, L, C] );
                            else if( tamilscript.logical[curr] )
                                self.mTokens.push( [curr, tamilscript.logical[curr]+':'+tamilscript.token.logical, L, C] );
                            else
                                self.mTokens.push( [ curr, tamilscript.token.identifier, L, C ] );
                        }
                        curr = ''; //reset
                        i = i + 1;
                    }
                }
            }
        },
        /* output javascript class */
        tamilTransformer : function( lexer ) {
            return {
                mLexer : lexer,
                generate : function () {
                    console.log('Not applicate @ moment');
                }
            }
        },
        parse : function ( src, res ) {
                var lexer = new tamilscript.tamilLexerClass();
                console.log('start lexing');
                lexer.lexer( $(src).val() );
                console.log('end lexing');
                var itr = 0;
                var output = '',tokens='';
                
                $(res).val( $(src).val().length + ' characters wide =>');
                var temp = '#temp';
                var prev_L = lexer.mTokens[0][3];
                var prev_C = lexer.mTokens[0][4];
                
                while( itr < lexer.mTokens.length ) {
                    var tok = lexer.mTokens[itr];
                    tokens = tokens + tok.join(' : ') + '\n';
                    
                    var tok_val = tok[0], L = tok[2], C = tok[3], tok_type = tok[1];
                    
                    // swap keywords
                    if ( tok_type.indexOf( tamilscript.token.keyword ) >= 0 ) {
                        tok_val  = tamilscript.keyword[tok_val];
                        console.log('KW => '+ tok[0]+':'+tok_val);
                    }
                    var prefix = '';
                    if ( prev_L != L ) {
                        prefix = '\n'; 
                        prev_C = 0; // reset col count
                    }
                    
                    if ( tok_val.indexOf('.') == -1 ) {
                        tok_val = prefix + tamilscript.spaces(Math.max(1,C-prev_C-tok_val.len)) + tok_val ;
                    }
                    console.log( tok_val )
                    output = output + tok_val;
                    itr = itr + 1;
                    
                    prev_L = L;
                    prev_C = C;
               }
               console.log( 'Output => '+output );
               $(temp).val( tokens );
               $(res).val( output  );
               return 0;
        }
    };
})();