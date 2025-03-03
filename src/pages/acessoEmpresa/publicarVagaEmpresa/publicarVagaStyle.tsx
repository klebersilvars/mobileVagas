import { StyleSheet } from "react-native";

 const PublicarVagaStyle = StyleSheet.create({
    container: {
        flex: 1, 
        display: 'flex',
        alignItems: 'center',
    },
    title_PublicarVaga: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 60,
        maxHeight: 85,
        padding: 10,
        backgroundColor: 'white'
    },
    title_NovosTalentos: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    bottomPublicarVaga: {
        backgroundColor: 'black',
        width: 100,
        maxWidth: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        maxHeight: 35,
        borderRadius: 10,
    },
    containerInput: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        textAlignVertical: 'top',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
    }
})

export default PublicarVagaStyle