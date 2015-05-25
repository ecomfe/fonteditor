
define(
    function (require) {

        var lang = require('common/lang');

        describe('测试overwrite', function () {

            it('test normal object', function () {
                var result = lang.overwrite(
                    {
                        x: 1
                    },
                    {
                        x: 2
                    }
                );
                expect(result.x).toBe(2);
            });

            it('test null object', function () {
                var result = lang.overwrite(
                    {
                        x: 1
                    },
                    null
                );
                expect(result.x).toBe(1);

                var result = lang.overwrite(
                    {
                        x: 1
                    },
                    undefined
                );
                expect(result.x).toBe(1);

                var result = lang.overwrite(
                    {
                        x: 1
                    },
                    false
                );
                expect(result.x).toBe(1);
            });

            it('test fields', function () {
                var result = lang.overwrite(
                    {
                        x: 1
                    },
                    {
                        x: 2
                    },
                    ['x']
                );
                expect(result.x).toBe(2);

                var result = lang.overwrite(
                    {
                        x: 1
                    },
                    {
                        x: 2
                    },
                    ['y']
                );
                expect(result.x).toBe(1);

            });

            it('test deep overwrite', function () {
                var result = lang.overwrite(
                    {
                        level1: {
                            x: 1
                        }
                    },
                    {
                        level1: {
                            y: 3
                        }
                    }
                );
                expect(result.level1.y).toBe(3);

                var result = lang.overwrite(
                    {
                        level1: {
                            x: 1
                        }
                    },
                    {
                        level1: {
                            x: 2
                        }
                    }
                );
                expect(result.level1.x).toBe(2);

            });


            it('test null overwrite', function () {
                var result = lang.overwrite(
                    {
                        level1: {
                            x: 1
                        }
                    },
                    {
                        level1: {
                            x: null
                        }
                    }
                );
                expect(result.level1.x).toBeNull();
            });

            it('test string overwrite', function () {
                var result = lang.overwrite(
                    'abcde',
                    {
                        0: 'f'
                    }
                );
                expect(result['0']).toBe('a');
            });
        });



        describe('测试equals', function () {

            it('test normal object', function () {
                var result = lang.equals(
                    {
                        x: 1
                    },
                    {
                        x: 2
                    }
                );
                expect(result).toBeFalsy();


                var result = lang.equals(
                    {
                        x: null
                    },
                    {
                        x: undefined
                    }
                );
                expect(result).toBeFalsy();

                var result = lang.equals(
                    {
                        x: 1
                    },
                    {
                        x: '1'
                    }
                );
                expect(result).toBeFalsy();

            });

            it('test basic type', function () {
                var result = lang.equals(
                    null,
                    undefined
                );
                expect(result).toBeTruthy();

                var result = lang.equals(
                    1,
                    2
                );
                expect(result).toBeFalsy();

                var result = lang.equals(
                    1,
                    '1'
                );
                expect(result).toBeFalsy();

            });

            it('test deep equals', function () {
                var result = lang.equals(
                    {
                        level1: {
                            x: 1
                        }
                    },
                    {
                        level1: {
                            y: 1
                        }
                    }
                );
                expect(result).toBeFalsy();

                var result = lang.equals(
                    {
                        level1: {
                            x: 1
                        }
                    },
                    {
                        level1: {
                            x: 1
                        }
                    }
                );
                expect(result).toBeTruthy();
            });
        });
    }
);
