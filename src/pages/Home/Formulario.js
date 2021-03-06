import React from 'react';

import { Form, Container, Row, Col, Button, ListGroup } from "react-bootstrap";

export default function Formulario() {

    const [showResults_Mediana, setShowResults_Mediana] = React.useState(false);
    const [showResults_Desvio_Padrao, setShowResults_Desvio_Padrao] = React.useState(false);
    const [showQuartis, setShowQuartis] = React.useState(false);

    const [desvio_padrao, setDesvio_Padrao] = React.useState(0);
    const [mediana, setMediana] = React.useState(0);
    const [limite_inferior, setLI] = React.useState(0);
    const [comprimento, setH] = React.useState(0);
    const [medium_value, setMDV] = React.useState(0);
    const [Fant, setFant] = React.useState(0);
    const [Fmd, setFmd] = React.useState(0);
    const [lista, setLista] = React.useState(["Resultados Salvos:"]);

    async function calcularQuartis(fi_input, classes_input, quartil) {
        let fac = [];
        let sum = 0;
        for (let i = 0; i < fi_input.length; i++) {
            sum += parseFloat(fi_input[i]);
            fac.push(sum);
        }
        let valor_medio = fac[fac.length - 1] * (quartil * (1 / 4));
        let classe_mediana = 0;
        for (let i = 0; i < fac.length; i++) {
            if (fac[i] >= valor_medio) {
                classe_mediana = i;
                break;
            }
        }

        setMDV(valor_medio);
        setH(parseFloat(classes_input[classe_mediana][1]) - parseFloat(classes_input[classe_mediana][0]));
        setLI(parseFloat(classes_input[classe_mediana][0]));
        setFant(fac[classe_mediana - 1]);
        setFmd(fi_input[classe_mediana]);

        setMediana(parseFloat(classes_input[classe_mediana][0]) + ((valor_medio - fac[classe_mediana - 1]) / fi_input[classe_mediana]) * (parseFloat(classes_input[classe_mediana][1]) - parseFloat(classes_input[classe_mediana][0])));

        setShowResults_Mediana(true);

        return parseFloat(classes_input[classe_mediana][0]) + ((valor_medio - fac[classe_mediana - 1]) / fi_input[classe_mediana]) * (parseFloat(classes_input[classe_mediana][1]) - parseFloat(classes_input[classe_mediana][0]));
    }

    async function calcularDesvio_Padrao(fi_input, classes_input) {
        let sum_FI = 0;

        for (let i = 0; i < fi_input.length; i++) {
            sum_FI += parseFloat(fi_input[i]);
        }

        let Xi = [];

        for (let i = 0; i < classes_input.length; i++) {
            Xi[i] = (parseFloat(classes_input[i][1]) + parseFloat(classes_input[i][0])) / 2;
        }

        let sum_XIFI = 0;

        for (let i = 0; i < fi_input.length; i++) {
            sum_XIFI += parseFloat(fi_input[i]) * Xi[i]
        }

        const media = sum_XIFI / sum_FI;

        let sum_numerador = 0;
        for (let i = 0; i < fi_input.length; i++) {
            sum_numerador += ((Xi[i] - media) ** 2) * parseFloat(fi_input[i]);
        }
        setDesvio_Padrao(Math.sqrt(sum_numerador / (sum_FI - 1)));
        setShowResults_Desvio_Padrao(true);
        return Math.sqrt(sum_numerador / (sum_FI - 1));
    }


    async function handleSubmit(event) {
        event.preventDefault();
        let classes_input = event.target.elements.formClasses.value.split(",");
        let fi_input = event.target.elements.formFI.value.split(",");
        let selection = event.target.elements.calculo.value;
        let quartil;
        if (selection === "Quartis") {
            quartil = parseInt(event.target.elements.quartis.value[0]);
        }
        let variacaoX = event.target.elements.variacaoX.value.split("-");
        let submited = event.nativeEvent.submitter.name;
        let result;
        let start = 0;
        let limit = 0;
        let respostas = lista.slice();

        //classes_input = "0-20,20-40,40-60,60-80".split(",");
        //fi_input = "4,30,12,x".split(",");


        for (let i = 0; i < classes_input.length; i++) {
            classes_input[i] = classes_input[i].split("-");
        }

        if (variacaoX[0] !== "") {
            start = parseInt(variacaoX[0]);
            limit = parseInt(variacaoX[1]);
        }
        for (let k = start; k <= limit; k++) {
            let fi_aux = fi_input.slice();
            for (let i = 0; i < fi_aux.length; i++) {
                if (fi_aux[i] === "x" | fi_aux[i] === "X") {
                    fi_aux[i] = `${k}`;
                }
            }

            if (selection === "Quartis") {
                setShowResults_Desvio_Padrao(false);
                result = await calcularQuartis(fi_aux, classes_input, quartil);
            }
            else if (selection === "Desvio Padrão") {
                setShowResults_Mediana(false);
                result = await calcularDesvio_Padrao(fi_aux, classes_input);
            }

            respostas.push(`${respostas.length} - ${selection}:     ${result}`);


        }

        if (submited === "calcular-salvar") {
            setLista(respostas);
        }
    }

    const handleSelect = (e) => {
        if (e.target.value === "Quartis") {
            setShowQuartis(true);
        }
        else {
            setShowQuartis(false);
        }
    }

    const NumeroQuartis = () => (
        <Form.Group controlId="quartis">
            <Form.Label>Selecione o quartil desejado</Form.Label>
            <Form.Control as="select" custom>
                <option>1</option>
                <option>2(Mediana)</option>
                <option>3</option>
            </Form.Control>
        </Form.Group>
    )

    const ResultsMediana = () => (
        <div id="results" className="search-results">
            <h4>Resultado = {mediana}</h4>

            <h4>Fórmula: Q = {limite_inferior} + (({medium_value} - {Fant}) / {Fmd}) x {comprimento}</h4>
        </div>
    )
    const ResultsDesvioPadrao = () => (
        <div id="results" className="search-results">
            <h4>S = {desvio_padrao}</h4>
        </div>
    )

    const FazerDownload = () => {
        console.log(lista);
        let rows1 = [];
        for(let i = 1; i < lista.length; i++) {
            rows1.push(lista[i].split("     "));
        }
        

        let csvContent = "data:text/csv;charset=utf-8,"
            + rows1.map(e => e.join(",")).join("\n");
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "respostas.csv");
        document.body.appendChild(link); // Required for FF

        link.click(); // This will download the data file named "my_data.csv".
    }

    const resetar = () => {
        setLista([]);
    }
    return (
        <Container className="formulario">
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="calculo">
                            <Form.Label>Selecione o cálculo desejado</Form.Label>
                            <Form.Control onChange={handleSelect} as="select" custom>
                                <option>Desvio Padrão</option>
                                <option>Quartis</option>
                            </Form.Control>
                        </Form.Group>
                        {showQuartis ? <NumeroQuartis /> : null}
                        <Form.Group controlId="formClasses">
                            <Form.Label>Classes</Form.Label>
                            <Form.Control type="text" placeholder="Digite os intervalos das classes separados por - e separe com vírgula(,) " />
                            <Form.Text className="text-muted">
                                Para criar 4 classes em intervalos de 10 a partir do 10: 10-20,20-30,30-40,40-50
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formFI">
                            <Form.Label>Frequencia Absoluta (FI)</Form.Label>
                            <Form.Control type="text" placeholder="Digite os valores separados por vírgula " />
                            <Form.Text className="text-muted">
                                Exemplo: 20,30,40,50
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="variacaoX">
                            <Form.Label>Selecione a variacao da variavel X, caso tenha utilizado</Form.Label>
                            <Form.Control type="text" placeholder="Digite o intervalo separado por - " />
                            <Form.Text className="text-muted">
                                Exemplo para que x varie de 1 até 20: 1-20
                            </Form.Text>
                        </Form.Group>
                        <Button variant="secondary" type="submit" name="calcular" value="calcular">
                            Calcular
                        </Button>

                        <Button variant="primary" type="submit" name="calcular-salvar" value="calcular-salvar">
                            Calcular e Salvar
                        </Button>
                        <Button onClick={resetar} variant="danger" name="resetar">
                            Resetar
                        </Button>
                    </Form>
                </Col>
                <Col>
                    {showResults_Mediana ? <ResultsMediana /> : null}
                    {showResults_Desvio_Padrao ? <ResultsDesvioPadrao /> : null}

                </Col>
            </Row>
            <Row>
                <ListGroup className="lista">
                    {lista.map(item => (
                        <ListGroup.Item key={item}>{item}</ListGroup.Item>
                    ))
                    }
                    <Button onClick={FazerDownload} variant="primary">
                        Download
                    </Button>
                </ListGroup>

            </Row>

        </Container>
    )
}